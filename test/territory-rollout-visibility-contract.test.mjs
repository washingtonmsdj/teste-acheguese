import assert from 'node:assert/strict';
import test from 'node:test';
import {
  HIDDEN_TERRITORY_SURFACE,
  resolveTerritorySurfaceVisibility,
} from '../src/features/territory-home/domain/surface-visibility.ts';

test('fail-closed sem rollout resolvido', () => {
  assert.deepEqual(
    resolveTerritorySurfaceVisibility(null),
    HIDDEN_TERRITORY_SURFACE,
  );
});

test('estágios não públicos permanecem noindex', () => {
  for (const stage of [
    'data_preparation',
    'internal_preview',
    'paused',
  ]) {
    assert.deepEqual(
      resolveTerritorySurfaceVisibility(stage),
      {
        stage,
        isPublic: false,
      },
    );
  }
});

test('somente public_preview e launched tornam a Surface pública', () => {
  for (const stage of [
    'public_preview',
    'launched',
  ]) {
    assert.deepEqual(
      resolveTerritorySurfaceVisibility(stage),
      {
        stage,
        isPublic: true,
      },
    );
  }
});
