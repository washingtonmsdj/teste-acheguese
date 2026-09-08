import assert from 'node:assert/strict';
import test from 'node:test';
import {
  activeTerritoryNavigation,
  territoryNavigationRegistry,
} from '../src/shared/navigation/territory-navigation.ts';

test('registry prepara módulos futuros sem expô-los antes da fase', () => {
  assert.deepEqual(
    activeTerritoryNavigation().map((item) => item.id),
    ['territory', 'map', 'classifieds'],
  );

  const planned = territoryNavigationRegistry
    .filter((item) => item.availability === 'planned')
    .map((item) => [item.id, item.phase]);

  assert.deepEqual(planned, [
    ['community', 5],
    ['alerts', 6],
    ['events', 6],
    ['opportunities', 6],
    ['businesses', 8],
  ]);
});
