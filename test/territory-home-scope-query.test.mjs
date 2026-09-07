import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseTerritoryScopeQuery,
} from '../src/features/territory-home/domain/scope-query.ts';

test('usa o Complexo quando bairro não foi informado', () => {
  assert.deepEqual(
    parseTerritoryScopeQuery(undefined),
    { kind: 'group' },
  );
  assert.deepEqual(
    parseTerritoryScopeQuery(''),
    { kind: 'group' },
  );
});

test('aceita slug territorial canônico', () => {
  assert.deepEqual(
    parseTerritoryScopeQuery(
      'nordeste-de-amaralina',
    ),
    {
      kind: 'neighborhood',
      slug: 'nordeste-de-amaralina',
    },
  );
});

test('rejeita valores que não podem virar chave de cache territorial', () => {
  assert.deepEqual(
    parseTerritoryScopeQuery('../admin'),
    { kind: 'invalid' },
  );
  assert.deepEqual(
    parseTerritoryScopeQuery('Santa Cruz'),
    { kind: 'invalid' },
  );
  assert.deepEqual(
    parseTerritoryScopeQuery('a'.repeat(81)),
    { kind: 'invalid' },
  );
});
