import assert from 'node:assert/strict';
import test from 'node:test';
import { hasClassifiedAdminRole } from '../src/lib/auth/roles.ts';

test('concede moderação somente pelo app_metadata assinado', () => {
  assert.equal(
    hasClassifiedAdminRole({
      sub: 'user-1',
      app_metadata: {
        role: 'classified_admin',
      },
    }),
    true,
  );
});

test('user_metadata nunca concede autoridade administrativa', () => {
  assert.equal(
    hasClassifiedAdminRole({
      sub: 'user-1',
      user_metadata: {
        role: 'classified_admin',
      },
    }),
    false,
  );
});

test('claims ausentes ou papel diferente são usuário comum', () => {
  assert.equal(hasClassifiedAdminRole(null), false);
  assert.equal(hasClassifiedAdminRole({}), false);
  assert.equal(hasClassifiedAdminRole({ app_metadata: null }), false);
  assert.equal(
    hasClassifiedAdminRole({
      app_metadata: {
        role: 'owner',
      },
    }),
    false,
  );
  assert.equal(
    hasClassifiedAdminRole({
      app_metadata: {
        role: ['classified_admin'],
      },
    }),
    false,
  );
});
