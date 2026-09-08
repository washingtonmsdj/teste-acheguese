import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const manifest = readFileSync(
  new URL('../src/config/territory-release-scope.ts', import.meta.url),
  'utf8',
);

test('escopo territorial do release possui uma autoridade compartilhada', () => {
  for (const expected of [
    'Complexo do Nordeste de Amaralina',
    'nordeste-de-amaralina',
    'santa-cruz',
    'vale-das-pedrinhas',
    'chapada-do-rio-vermelho',
  ]) {
    assert.equal(manifest.includes(expected), true);
  }
});

test('runtime territorial consome o manifesto compartilhado', () => {
  const runtimePaths = [
    '../src/features/territory-home/components/territory-home.tsx',
    '../src/features/territory-home/server/load-territory-home.ts',
    '../src/features/territory-home/server/territory-rollout-visibility.ts',
    '../src/app/api/health/route.ts',
  ];

  for (const path of runtimePaths) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8');
    assert.match(source, /territoryReleaseScope/);
    assert.equal(
      source.includes("'complexo-do-nordeste-de-amaralina'"),
      false,
      `${path} não deve duplicar o slug do grupo`,
    );
  }
});


test('superfícies visuais consomem o contexto territorial compartilhado', () => {
  const paths = [
    '../src/shared/layout/territory-app-shell.tsx',
    '../src/app/loading.tsx',
    '../src/app/mapa/page.tsx',
    '../src/app/mapa/loading.tsx',
    '../src/app/buscar/page.tsx',
    '../src/app/menu/page.tsx',
    '../src/app/entrar/page.tsx',
    '../src/app/classificados/page.tsx',
    '../src/integrations/map/territory-map-explorer.tsx',
  ];

  for (const path of paths) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8');
    assert.equal(
      source.includes('Complexo do Nordeste de Amaralina'),
      false,
      `${path} não deve duplicar o nome do grupo`,
    );
    assert.equal(
      source.includes('Salvador · BA'),
      false,
      `${path} não deve duplicar o rótulo da cidade`,
    );
  }
});
