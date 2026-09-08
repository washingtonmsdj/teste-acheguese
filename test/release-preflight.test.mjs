import assert from 'node:assert/strict';
import test from 'node:test';
import {
  decodeGitHubContent,
  normalizeRepository,
  normalizeSha,
  selectSuccessfulWorkflowRun,
  validateReleaseState,
} from '../scripts/release-preflight-core.mjs';

const SHA = 'a'.repeat(40);
const OTHER_SHA = 'b'.repeat(40);

function run(name, overrides = {}) {
  return {
    id: 10,
    name,
    status: 'completed',
    conclusion: 'success',
    head_sha: SHA,
    run_number: 10,
    html_url: 'https://github.example/run/10',
    ...overrides,
  };
}

test('normaliza SHA e repositório canônicos', () => {
  assert.equal(normalizeSha(SHA.toUpperCase()), SHA);
  assert.equal(
    normalizeRepository('washingtonmsdj/teste-acheguese'),
    'washingtonmsdj/teste-acheguese',
  );
  assert.throws(() => normalizeSha('abc'), /inválido/);
  assert.throws(
    () => normalizeRepository('https://github.com/x/y'),
    /inválido/,
  );
});

test('decodifica SOURCE_SHA da GitHub Contents API', () => {
  assert.equal(
    decodeGitHubContent({
      encoding: 'base64',
      content: Buffer.from(`${SHA}\n`).toString('base64'),
    }),
    SHA,
  );
});

test('seleciona somente PASS do workflow no HEAD exato', () => {
  const selected = selectSuccessfulWorkflowRun(
    [
      run('quality', { id: 1, conclusion: 'failure' }),
      run('quality', { id: 2, head_sha: OTHER_SHA }),
      run('quality', { id: 3, run_number: 11 }),
    ],
    'quality',
    SHA,
  );

  assert.equal(selected?.id, 3);
});

test('preflight passa somente com checkout, transport e workflows alinhados', () => {
  const result = validateReleaseState({
    localSha: SHA,
    mainSha: SHA,
    transportSha: SHA,
    workflowRuns: [
      run('quality'),
      run('vercel-source-bundle', { id: 11 }),
    ],
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.workflows.quality.id, 10);
  assert.equal(
    result.workflows['vercel-source-bundle'].id,
    11,
  );
});

test('preflight falha fechado para transport antigo ou CI ausente', () => {
  const result = validateReleaseState({
    localSha: SHA,
    mainSha: SHA,
    transportSha: OTHER_SHA,
    workflowRuns: [run('quality')],
  });

  assert.equal(result.ok, false);
  assert.equal(result.errors.length, 2);
  assert.match(result.errors[0], /transport desatualizado/);
  assert.match(
    result.errors[1],
    /vercel-source-bundle/,
  );
});
