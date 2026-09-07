import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('quality mantém scanner de segredos versionado', () => {
  const quality = readFileSync(
    new URL('../.github/workflows/quality.yml', import.meta.url),
    'utf8',
  );
  const packageJson = JSON.parse(
    readFileSync(
      new URL('../package.json', import.meta.url),
      'utf8',
    ),
  );
  const scanner = readFileSync(
    new URL(
      '../scripts/ci/scan-repository-secrets.mjs',
      import.meta.url,
    ),
    'utf8',
  );

  assert.equal(
    packageJson.scripts['security:scan'],
    'node ./scripts/ci/scan-repository-secrets.mjs',
  );
  assert.equal(
    quality.includes('npm run security:scan'),
    true,
  );
  assert.equal(
    scanner.includes('.env.example'),
    true,
  );
  assert.equal(
    scanner.includes('sb_secret_'),
    true,
  );
  assert.equal(
    scanner.includes('SUPABASE_SERVICE_ROLE_KEY'),
    true,
  );
});
