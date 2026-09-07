import assert from 'node:assert/strict';
import test from 'node:test';
import {
  trustedAuthCallbackOrigin,
  trustedAuthOrigin,
  vercelDeploymentOrigin,
} from '../src/lib/auth/origin-core.ts';
import { safeInternalPath } from '../src/lib/safe-path.ts';

test('aceita somente caminhos internos seguros', () => {
  assert.equal(
    safeInternalPath('/classificados/meus?tab=ativos'),
    '/classificados/meus?tab=ativos',
  );
  assert.equal(safeInternalPath('//evil.example'), '/');
  assert.equal(safeInternalPath('/\\evil.example'), '/');
  assert.equal(safeInternalPath('https://evil.example'), '/');
  assert.equal(safeInternalPath('/%2F%2Fevil.example'), '/');
  assert.equal(safeInternalPath('/%5Cevil.example'), '/');
  assert.equal(safeInternalPath('/%252F%252Fevil.example'), '/');
  assert.equal(
    safeInternalPath('/%0d%0aLocation:https://evil.example'),
    '/',
  );
  assert.equal(safeInternalPath('/%'), '/');
  assert.equal(
    safeInternalPath('/classificados/meus?next=%2Ffoo'),
    '/classificados/meus?next=%2Ffoo',
  );
  assert.equal(safeInternalPath(null, '/fallback'), '/fallback');
});

test('produção usa somente a URL canônica para callback', () => {
  const siteUrl = 'https://acheguese.example';

  assert.equal(
    trustedAuthOrigin(siteUrl, null, 'https://evil.example'),
    null,
  );
  assert.equal(
    trustedAuthCallbackOrigin(siteUrl, null, siteUrl),
    true,
  );
  assert.equal(
    trustedAuthCallbackOrigin(siteUrl, null, 'https://preview.example'),
    false,
  );
});

test('sem URL canônica só localhost HTTP é aceito para desenvolvimento', () => {
  assert.equal(
    trustedAuthOrigin(null, null, 'http://localhost:3000'),
    'http://localhost:3000',
  );
  assert.equal(
    trustedAuthOrigin(null, null, 'http://127.0.0.1:3000'),
    'http://127.0.0.1:3000',
  );
  assert.equal(
    trustedAuthOrigin(null, null, 'https://preview.example'),
    null,
  );
  assert.equal(
    trustedAuthOrigin(null, null, 'http://evil.example'),
    null,
  );
  assert.equal(
    trustedAuthCallbackOrigin(null, null, 'http://localhost:3000'),
    true,
  );
  assert.equal(
    trustedAuthCallbackOrigin(null, null, 'https://preview.example'),
    false,
  );
});

test('requisições mutáveis de auth exigem origem canônica', () => {
  const siteUrl = 'https://acheguese.example';

  assert.equal(
    trustedAuthCallbackOrigin(
      siteUrl,
      null,
      'https://acheguese.example',
    ),
    true,
  );
  assert.equal(
    trustedAuthCallbackOrigin(
      siteUrl,
      null,
      'https://evil.example',
    ),
    false,
  );
  assert.equal(
    trustedAuthCallbackOrigin(
      siteUrl,
      null,
      '',
    ),
    false,
  );
});

test('produção rejeita Origin ausente, com path ou não canônica', () => {
  const siteUrl = 'https://acheguese.example';

  assert.equal(
    trustedAuthOrigin(siteUrl, null, null),
    null,
  );
  assert.equal(
    trustedAuthOrigin(
      siteUrl,
      null,
      'https://acheguese.example/path',
    ),
    null,
  );
  assert.equal(
    trustedAuthOrigin(
      siteUrl,
      null,
      'https://acheguese.example/',
    ),
    null,
  );
  assert.equal(
    trustedAuthOrigin(
      siteUrl,
      null,
      'https://acheguese.example',
    ),
    siteUrl,
  );
});

test('deployment Vercel atual é uma segunda origem Auth exata', () => {
  const deploymentOrigin = vercelDeploymentOrigin(
    '1',
    'teste-acheguese-abc123.vercel.app',
  );

  assert.equal(
    deploymentOrigin,
    'https://teste-acheguese-abc123.vercel.app',
  );
  assert.equal(
    trustedAuthOrigin(
      'https://teste-acheguese.vercel.app',
      deploymentOrigin,
      deploymentOrigin,
    ),
    deploymentOrigin,
  );
  assert.equal(
    trustedAuthOrigin(
      'https://teste-acheguese.vercel.app',
      deploymentOrigin,
      'https://outro-preview.vercel.app',
    ),
    null,
  );
});

test('VERCEL_URL só é aceita quando vem do ambiente Vercel e é vercel.app', () => {
  assert.equal(
    vercelDeploymentOrigin(
      undefined,
      'preview.vercel.app',
    ),
    null,
  );
  assert.equal(
    vercelDeploymentOrigin(
      '1',
      'evil.example',
    ),
    null,
  );
  assert.equal(
    vercelDeploymentOrigin(
      '1',
      'preview.vercel.app/path',
    ),
    null,
  );
});
