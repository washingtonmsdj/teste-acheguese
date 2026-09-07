import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const workflowPaths = [
  '.github/workflows/quality.yml',
  '.github/workflows/territory-data-probe.yml',
  '.github/workflows/vercel-source-bundle.yml',
];

function read(path) {
  return readFileSync(
    new URL(`../${path}`, import.meta.url),
    'utf8',
  );
}

test('workflows não usam gatilhos privilegiados em código não confiável', () => {
  for (const path of workflowPaths) {
    const source = read(path);

    for (const trigger of [
      'pull_request_target:',
      'workflow_run:',
      'repository_dispatch:',
    ]) {
      assert.equal(
        source.includes(trigger),
        false,
        `${path} não deve usar ${trigger}`,
      );
    }
  }
});

test('jobs read-only não persistem credencial do checkout', () => {
  const quality = read('.github/workflows/quality.yml');
  const probe = read(
    '.github/workflows/territory-data-probe.yml',
  );
  const bundle = read(
    '.github/workflows/vercel-source-bundle.yml',
  );

  assert.equal(
    quality.includes('persist-credentials: false'),
    true,
  );

  const probeCheckoutCount = (
    probe.match(/uses: actions\/checkout@v7/g) ?? []
  ).length;
  const probeSafeCount = (
    probe.match(/persist-credentials: false/g) ?? []
  ).length;

  assert.equal(probeSafeCount, probeCheckoutCount);

  const validateSection = bundle.split('  publish:')[0];
  assert.equal(
    validateSection.includes(
      'persist-credentials: false',
    ),
    true,
  );
});

test('somente publish do bundle recebe contents write e exige main', () => {
  const bundle = read(
    '.github/workflows/vercel-source-bundle.yml',
  );

  assert.equal(
    (bundle.match(/contents: write/g) ?? []).length,
    1,
  );
  assert.equal(
    bundle.includes(
      "if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'",
    ),
    true,
  );
});
