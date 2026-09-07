import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isValidMapBounds,
  normalizeMapViewportQuery,
} from '../src/core/map/domain/validation.ts';

const complexoBounds = {
  west: -38.4873837606422,
  south: -13.0134576151743,
  east: -38.4668939364098,
  north: -12.9958446983238,
};

test('aceita bbox canônico do Complexo', () => {
  assert.equal(isValidMapBounds(complexoBounds), true);
});

test('rejeita bbox invertido', () => {
  assert.equal(
    isValidMapBounds({
      ...complexoBounds,
      west: complexoBounds.east,
      east: complexoBounds.west,
    }),
    false,
  );
});

test('normaliza layers, categorias e limites', () => {
  const query = normalizeMapViewportQuery({
    bounds: complexoBounds,
    zoom: 14,
    layers: ['boundaries', 'public_places', 'public_places'],
    publicPlaceCategories: ['health', 'health', 'education'],
    placeLimit: 9999,
    boundaryLimit: 0,
  });

  assert.deepEqual(query.layers, [
    'boundaries',
    'public_places',
  ]);
  assert.deepEqual(query.publicPlaceCategories, [
    'health',
    'education',
  ]);
  assert.equal(query.placeLimit, 500);
  assert.equal(query.boundaryLimit, 1);
});

test('rejeita mais de dez categorias mesmo fora da rota HTTP', () => {
  assert.throws(
    () =>
      normalizeMapViewportQuery({
        bounds: complexoBounds,
        zoom: 14,
        layers: ['public_places'],
        publicPlaceCategories: [
          'a','b','c','d','e','f','g','h','i','j','k',
        ],
      }),
    /map_categories_invalid/,
  );
});

test('rejeita chave de categoria fora do contrato canônico', () => {
  assert.throws(
    () =>
      normalizeMapViewportQuery({
        bounds: complexoBounds,
        zoom: 14,
        layers: ['public_places'],
        publicPlaceCategories: ['education', 'Bad Category'],
      }),
    /map_categories_invalid/,
  );
});

test('rejeita bbox amplo demais para a consulta raw de viewport', () => {
  assert.throws(
    () =>
      normalizeMapViewportQuery({
        bounds: {
          west: -40,
          south: -14,
          east: -37,
          north: -12,
        },
        zoom: 10,
        layers: ['boundaries'],
      }),
    /map_bbox_too_large/,
  );
});

test('rejeita zoom abaixo do contrato local do Map Core v1', () => {
  assert.throws(
    () =>
      normalizeMapViewportQuery({
        bounds: complexoBounds,
        zoom: 9,
        layers: ['boundaries'],
      }),
    /map_zoom_unsupported/,
  );
});

test('rejeita zoom inválido', () => {
  assert.throws(
    () =>
      normalizeMapViewportQuery({
        bounds: complexoBounds,
        zoom: 30,
        layers: ['boundaries'],
      }),
    /map_zoom_invalid/,
  );
});
