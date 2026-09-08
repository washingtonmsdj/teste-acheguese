import { execFileSync } from 'node:child_process';
import {
  decodeGitHubContent,
  normalizeRepository,
  normalizeSha,
  validateReleaseState,
} from './release-preflight-core.mjs';

const repository = normalizeRepository(
  process.env.RELEASE_REPOSITORY ??
    'washingtonmsdj/teste-acheguese',
);
const token = process.env.GITHUB_TOKEN?.trim() || null;

function localHeadSha() {
  const explicit = process.env.RELEASE_SOURCE_SHA?.trim();

  if (explicit) {
    return normalizeSha(explicit, 'RELEASE_SOURCE_SHA');
  }

  try {
    return normalizeSha(
      execFileSync('git', ['rev-parse', 'HEAD'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }),
      'HEAD local',
    );
  } catch {
    throw new Error(
      'não foi possível ler o HEAD local; execute em um checkout Git ou defina RELEASE_SOURCE_SHA',
    );
  }
}

async function githubRequest(path) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'acheguese-release-preflight',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com${path}`,
    {
      headers,
      signal: AbortSignal.timeout(15_000),
    },
  );

  if (!response.ok) {
    throw new Error(
      `GitHub API ${response.status} em ${path}`,
    );
  }

  return response.json();
}

async function run() {
  const encodedRepository = repository
    .split('/')
    .map(encodeURIComponent)
    .join('/');
  const localSha = localHeadSha();

  const [branch, sourceFile, workflowPayload] =
    await Promise.all([
      githubRequest(
        `/repos/${encodedRepository}/branches/main`,
      ),
      githubRequest(
        `/repos/${encodedRepository}/contents/SOURCE_SHA?ref=${encodeURIComponent('deploy/vercel-bundle')}`,
      ),
      githubRequest(
        `/repos/${encodedRepository}/actions/runs?branch=main&per_page=100`,
      ),
    ]);

  const mainSha = normalizeSha(
    branch?.commit?.sha,
    'HEAD remoto da main',
  );
  const transportSha = normalizeSha(
    decodeGitHubContent(sourceFile),
    'SOURCE_SHA do transport',
  );
  const result = validateReleaseState({
    localSha,
    mainSha,
    transportSha,
    workflowRuns: workflowPayload?.workflow_runs,
  });

  if (!result.ok) {
    for (const error of result.errors) {
      console.error(`FAIL ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `PASS release source closure head=${result.headSha}`,
  );
  for (const [name, workflow] of Object.entries(
    result.workflows,
  )) {
    console.log(
      `PASS ${name} run=${workflow.id ?? 'unknown'}`,
    );
  }
}

run().catch((error) => {
  console.error(
    'PREDEPLOY FAIL',
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
