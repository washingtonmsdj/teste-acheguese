import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseSupabasePublicConfig,
} from '../src/lib/supabase/config.ts';

test('aceita e normaliza configuração pública Supabase válida', () => {
  assert.deepEqual(
    parseSupabasePublicConfig(
      ' https://project.supabase.co/ ',
      ' sb_publishable_test ',
    ),
    {
      url: 'https://project.supabase.co',
      publishableKey: 'sb_publishable_test',
    },
  );
});

test('rejeita URL Supabase malformada sem lançar exceção', () => {
  for (const value of [
    'not-a-url',
    'project.supabase.co',
    'ftp://project.supabase.co',
    'https://user:pass@project.supabase.co',
    'https://project.supabase.co?bad=1',
    'https://project.supabase.co#bad',
  ]) {
    assert.equal(
      parseSupabasePublicConfig(
        value,
        'sb_publishable_test',
      ),
      null,
    );
  }
});

test('configuração incompleta fica fail-closed', () => {
  assert.equal(
    parseSupabasePublicConfig(
      'https://project.supabase.co',
      undefined,
    ),
    null,
  );
  assert.equal(
    parseSupabasePublicConfig(
      undefined,
      'sb_publishable_test',
    ),
    null,
  );
});
