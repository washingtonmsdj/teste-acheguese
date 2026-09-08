import assert from 'node:assert/strict';
import test from 'node:test';
import {
  activeTerritoryNavigation,
  activeMobileNavigation,
  activeTerritoryNavigationBySection,
  mvpTerritoryNavigation,
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


test('registry distribui navegação ativa por zona sem duplicar autoridade', () => {
  assert.deepEqual(
    activeTerritoryNavigationBySection('territory').map(
      (item) => item.id,
    ),
    ['territory', 'map'],
  );
  assert.deepEqual(
    activeTerritoryNavigationBySection('local-life').map(
      (item) => item.id,
    ),
    [],
  );
  assert.deepEqual(
    activeTerritoryNavigationBySection('services').map(
      (item) => item.id,
    ),
    ['classifieds'],
  );
});


test('bottom navigation também deriva do registry único', () => {
  assert.deepEqual(
    activeMobileNavigation().map((item) => item.id),
    ['territory', 'map', 'classifieds'],
  );

  const community = territoryNavigationRegistry.find(
    (item) => item.id === 'community',
  );

  assert.equal(community?.mobilePrimary, true);
  assert.equal(community?.availability, 'planned');
});


test('escopo explícito do MVP não inclui módulos futuros', () => {
  assert.deepEqual(
    mvpTerritoryNavigation().map((item) => item.id),
    ['territory', 'map', 'classifieds'],
  );

  const future = territoryNavigationRegistry
    .filter((item) => item.releaseScope === 'future')
    .map((item) => item.id);

  assert.deepEqual(future, [
    'community',
    'alerts',
    'events',
    'opportunities',
    'businesses',
  ]);
});

test('um módulo futuro não aparece só por ficar active', () => {
  const futureActive = territoryNavigationRegistry
    .filter(
      (item) =>
        item.releaseScope === 'future' &&
        item.availability === 'active',
    )
    .map((item) => item.id);

  assert.deepEqual(futureActive, []);
});
