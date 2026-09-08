import assert from 'node:assert/strict';
import test from 'node:test';
import {
  validatePublicEnv,
} from '../scripts/public-env-contract.mjs';

test('preflight permite CI sem configuração pública', () => {
  assert.deepEqual(
    validatePublicEnv({}),
    {
      ok: true,
      supabaseConfigured: false,
    },
  );
});

test('preflight rejeita par Supabase incompleto', () => {
  assert.equal(
    validatePublicEnv({
      NEXT_PUBLIC_SUPABASE_URL:
        'https://project.supabase.co',
    }).error,
    'supabase_pair_incomplete',
  );
});

test('preflight rejeita URL Supabase malformada', () => {
  assert.equal(
    validatePublicEnv({
      NEXT_PUBLIC_SUPABASE_URL: 'project.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        'sb_publishable_test',
    }).error,
    'supabase_url_invalid',
  );
});

test('preflight valida site URL e origens extras do mapa', () => {
  assert.equal(
    validatePublicEnv({
      NEXT_PUBLIC_SITE_URL:
        'https://acheguese.example/path',
    }).error,
    'site_url_invalid',
  );

  assert.equal(
    validatePublicEnv({
      NEXT_PUBLIC_MAP_CSP_ORIGINS:
        'https://tiles.example, ftp://bad.example',
    }).error,
    'map_csp_origin_invalid',
  );
});


test('preflight Vercel/release exige configuração pública completa', () => {
  assert.equal(
    validatePublicEnv(
      {},
      { requirePublicConfig: true },
    ).error,
    'supabase_required',
  );

  assert.equal(
    validatePublicEnv(
      {
        NEXT_PUBLIC_SUPABASE_URL:
          'https://project.supabase.co',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
          'sb_publishable_test',
      },
      { requirePublicConfig: true },
    ).error,
    'site_url_required',
  );

  assert.deepEqual(
    validatePublicEnv(
      {
        NEXT_PUBLIC_SITE_URL:
          'https://acheguese.example',
        NEXT_PUBLIC_SUPABASE_URL:
          'https://project.supabase.co',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
          'sb_publishable_test',
      },
      { requirePublicConfig: true },
    ),
    {
      ok: true,
      supabaseConfigured: true,
    },
  );
});
