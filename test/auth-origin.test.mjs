import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getTrustedAuthOrigin,
  isTrustedAuthCallbackOrigin,
} from '../src/lib/auth/origin.ts';
import { safeInternalPath } from '../src/lib/safe-path.ts';

function withSiteUrl(value, fn) {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;

  if (value === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = value;
  }

  try {
    fn();
  } finally {
    if (previous === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = previous;
    }
  }
}

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
  withSiteUrl('https://acheguese.example', () => {
    assert.equal(
      getTrustedAuthOrigin('https://evil.example'),
      'https://acheguese.example',
    );
    assert.equal(
      isTrustedAuthCallbackOrigin('https://acheguese.example'),
      true,
    );
    assert.equal(
      isTrustedAuthCallbackOrigin('https://preview.example'),
      false,
    );
  });
});

test('sem URL canônica só localhost HTTP é aceito para desenvolvimento', () => {
  withSiteUrl(undefined, () => {
    assert.equal(
      getTrustedAuthOrigin('http://localhost:3000'),
      'http://localhost:3000',
    );
    assert.equal(
      getTrustedAuthOrigin('http://127.0.0.1:3000'),
      'http://127.0.0.1:3000',
    );
    assert.equal(
      getTrustedAuthOrigin('https://preview.example'),
      null,
    );
    assert.equal(
      getTrustedAuthOrigin('http://evil.example'),
      null,
    );
  });
});
