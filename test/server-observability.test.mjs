import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildServerErrorEvent,
} from '../src/core/observability/server-log.ts';

test('estrutura evento server-side sem stack ou contexto arbitrário', () => {
  const error = new Error('database unavailable');
  error.stack = 'sensitive stack';

  const event = buildServerErrorEvent(
    'territory.home.load_failed',
    error,
    {
      scope: 'group',
      count: 4,
      'bad key!': 'ignored',
    },
  );

  assert.deepEqual(event, {
    level: 'error',
    event: 'territory.home.load_failed',
    errorName: 'Error',
    message: 'database unavailable',
    context: {
      scope: 'group',
      count: 4,
    },
  });
  assert.equal('stack' in event, false);
});

test('redige chaves Supabase/JWT e limita strings', () => {
  const event = buildServerErrorEvent(
    'health.territory_canary_failed',
    new Error(
      'token sb_secret_abcdefghijklmnop eyJabcdefghijklmnop.qrstuvwxyzabcdefghi.abcdefghij',
    ),
    {
      note:
        'sb_publishable_abcdefghijklmnopqrstuvwxyz',
    },
  );

  assert.equal(
    event.message.includes('sb_secret_'),
    false,
  );
  assert.equal(
    String(event.context.note).includes(
      'sb_publishable_',
    ),
    false,
  );
});

test('evento inválido cai para código canônico', () => {
  const event = buildServerErrorEvent(
    'INVALID EVENT WITH SPACE',
    'no error object',
  );

  assert.equal(event.event, 'server.error');
  assert.equal(event.errorName, 'UnknownError');
  assert.equal(event.message, 'unknown_error');
});
