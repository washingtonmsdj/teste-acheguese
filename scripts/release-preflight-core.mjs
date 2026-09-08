export const REQUIRED_WORKFLOWS = [
  'quality',
  'vercel-source-bundle',
];

export function normalizeSha(value, label = 'SHA') {
  const sha = String(value ?? '').trim().toLowerCase();

  if (!/^[0-9a-f]{40}$/.test(sha)) {
    throw new Error(`${label} inválido`);
  }

  return sha;
}

export function normalizeRepository(value) {
  const repository = String(value ?? '').trim();

  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new Error('repositório GitHub inválido');
  }

  return repository;
}

export function decodeGitHubContent(payload) {
  if (
    !payload ||
    payload.encoding !== 'base64' ||
    typeof payload.content !== 'string'
  ) {
    throw new Error('payload GitHub Contents inválido');
  }

  return Buffer.from(
    payload.content.replace(/\s+/g, ''),
    'base64',
  )
    .toString('utf8')
    .trim();
}

export function selectSuccessfulWorkflowRun(
  runs,
  workflowName,
  headSha,
) {
  const expectedSha = normalizeSha(headSha, 'HEAD');

  const matches = (Array.isArray(runs) ? runs : []).filter(
    (run) =>
      run?.name === workflowName &&
      run?.status === 'completed' &&
      run?.conclusion === 'success' &&
      String(run?.head_sha ?? '').toLowerCase() === expectedSha,
  );

  return (
    matches.sort(
      (a, b) =>
        Number(b?.run_number ?? 0) -
        Number(a?.run_number ?? 0),
    )[0] ?? null
  );
}

export function validateReleaseState({
  localSha,
  mainSha,
  transportSha,
  workflowRuns,
  requiredWorkflows = REQUIRED_WORKFLOWS,
}) {
  const local = normalizeSha(localSha, 'SHA local');
  const main = normalizeSha(mainSha, 'SHA da main');
  const transport = normalizeSha(
    transportSha,
    'SOURCE_SHA do transport',
  );
  const errors = [];

  if (local !== main) {
    errors.push(
      `checkout não está no HEAD da main: local=${local} main=${main}`,
    );
  }

  if (transport !== main) {
    errors.push(
      `transport desatualizado: transport=${transport} main=${main}`,
    );
  }

  const workflows = {};

  for (const name of requiredWorkflows) {
    const run = selectSuccessfulWorkflowRun(
      workflowRuns,
      name,
      main,
    );

    if (!run) {
      errors.push(
        `workflow sem PASS para o HEAD atual: ${name}`,
      );
      continue;
    }

    workflows[name] = {
      id: run.id ?? null,
      runNumber: run.run_number ?? null,
      url: run.html_url ?? null,
    };
  }

  return {
    ok: errors.length === 0,
    errors,
    headSha: main,
    workflows,
  };
}
