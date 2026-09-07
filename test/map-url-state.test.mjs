import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatMapUrlState,
  parseMapUrlState,
} from '../src/core/map/domain/url-state.ts';

const fallback = {
  bounds: {
    west: -38.4873837606422,
    south: -13.0134576151743,
    east: -38.4668939364098,
    north: -12.9958446983238,
  },
  zoom: 14,
  categories: ['education', 'health'],
};

test('restaura viewport e categorias de um deep link', () => {
  const state = parseMapUrlState(
    {
      west: '-38.48',
      south: '-13.01',
      east: '-38.47',
      north: '-13',
      zoom: '15.5',
      categories: 'health',
    },
    fallback,
  );

  assert.equal(state.zoom, 15.5);
  assert.deepEqual(state.categories, ['health']);
  assert.equal(state.bounds.west, -38.48);
});

test('representa todas as categorias desligadas explicitamente', () => {
  const state = parseMapUrlState(
    {
      west: '-38.48',
      south: '-13.01',
      east: '-38.47',
      north: '-13',
      zoom: '15',
      categories: 'none',
    },
    fallback,
  );

  assert.deepEqual(state.categories, []);
});

test('cai para estado seguro quando bbox é inválido', () => {
  const state = parseMapUrlState(
    {
      west: '-38.46',
      south: '-13.01',
      east: '-38.49',
      north: '-13',
      zoom: '14',
      categories: 'health',
    },
    fallback,
  );

  assert.deepEqual(state, fallback);
});

test('cai para o estado seguro em deep link amplo ou com zoom muito baixo', () => {
  const wide = parseMapUrlState(
    {
      west: '-40',
      south: '-14',
      east: '-37',
      north: '-12',
      zoom: '10',
      categories: 'health',
    },
    fallback,
  );

  const lowZoom = parseMapUrlState(
    {
      west: '-38.48',
      south: '-13.01',
      east: '-38.47',
      north: '-13',
      zoom: '5',
      categories: 'health',
    },
    fallback,
  );

  assert.deepEqual(wide, fallback);
  assert.deepEqual(lowZoom, fallback);
});

test('serializa estado com precisão limitada e categorias estáveis', () => {
  const params = formatMapUrlState({
    bounds: {
      west: -38.4873837606422,
      south: -13.0134576151743,
      east: -38.4668939364098,
      north: -12.9958446983238,
    },
    zoom: 14.12345,
    categories: ['health', 'education', 'health'],
  });

  assert.equal(params.west, '-38.487384');
  assert.equal(params.zoom, '14.12');
  assert.equal(params.categories, 'education,health');
});
