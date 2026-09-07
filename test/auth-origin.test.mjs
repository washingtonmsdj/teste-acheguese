import assert from 'node:assert/strict';
import test from 'node:test';
import {
  trustedAuthCallbackOrigin,
  trustedAuthOrigin,
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
  assert.equal(safeInternalPath(null, '/fallback'), '/fallback');
});

test('produção usa somente a URL canônica para callback', () => {
  const siteUrl = 'https://acheguese.example';

  assert.equal(
    trustedAuthOrigin(siteUrl, 'https://evil.example'),
    null,
  );
  assert.equal(
    trustedAuthCallbackOrigin(siteUrl, siteUrl),
    true,
  );
  assert.equal(
    trustedAuthCallbackOrigin(siteUrl, 'https://preview.example'),
    false,
  );
});

test('sem URL canônica só localhost HTTP é aceito para desenvolvimento', () => {
  assert.equal(
    trustedAuthOrigin(null, 'http://localhost:3000'),
    'http://localhost:3000',
  );
  assert.equal(
    trustedAuthOrigin(null, 'http://127.0.0.1:3000'),
    'http://127.0.0.1:3000',
  );
  assert.equal(
    trustedAuthOrigin(null, 'https://preview.example'),
    null,
  );
  assert.equal(
    trustedAuthOrigin(null, 'http://evil.example'),
    null,
  );
  assert.equal(
    trustedAuthCallbackOrigin(null, 'http://localhost:3000'),
    true,
  );
  assert.equal(
    trustedAuthCallbackOrigin(null, 'https://preview.example'),
    false,
  );
});

test('requisições mutáveis de auth exigem origem canônica', () => {
  const siteUrl = 'https://acheguese.example';

  assert.equal(
    trustedAuthCallbackOrigin(
      siteUrl,
      'https://acheguese.example',
    ),
    true,
  );
  assert.equal(
    trustedAuthCallbackOrigin(
      siteUrl,
      'https://evil.example',
    ),
    false,
  );
  assert.equal(
    trustedAuthCallbackOrigin(
      siteUrl,
      '',
    ),
    false,
  );
});

test('produção rejeita Origin ausente, com path ou não canônica', () => {
  const siteUrl = 'https://acheguese.example';

  assert.equal(
    trustedAuthOrigin(siteUrl, null),
    null,
  );
  assert.equal(
    trustedAuthOrigin(
      siteUrl,
      'https://acheguese.example/path',
    ),
    null,
  );
  assert.equal(
    trustedAuthOrigin(
      siteUrl,
      'https://acheguese.example/',
    ),
    null,
  );
  assert.equal(
    trustedAuthOrigin(
      siteUrl,
      'https://acheguese.example',
    ),
    siteUrl,
  );
});
