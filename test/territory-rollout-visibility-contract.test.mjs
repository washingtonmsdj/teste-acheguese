import assert from 'node:assert/strict';
import test from 'node:test';

const HIDDEN = {
  stage: null,
  isPublic: false,
};

test('contrato fail-closed de visibilidade territorial permanece explícito', () => {
  assert.deepEqual(HIDDEN, {
    stage: null,
    isPublic: false,
  });
  assert.equal(HIDDEN.isPublic, false);
});
