import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function read(relativePath) {
  return readFileSync(
    new URL(relativePath, import.meta.url),
    'utf8',
  );
}

test('Home e Mapa usam o Territory App Shell canônico', () => {
  const home = read(
    '../src/features/territory-home/components/territory-home.tsx',
  );
  const map = read('../src/app/mapa/page.tsx');
  const loading = read('../src/app/loading.tsx');
  const mapLoading = read('../src/app/mapa/loading.tsx');

  for (const [name, source] of [
    ['home', home],
    ['map', map],
    ['home loading', loading],
    ['map loading', mapLoading],
  ]) {
    assert.match(
      source,
      /TerritoryAppShell/,
      `${name} precisa permanecer no App Shell territorial`,
    );
  }

  assert.equal(
    home.includes('<SiteHeader'),
    false,
    'Home não pode voltar ao header isolado',
  );
  assert.equal(
    map.includes('<SiteHeader'),
    false,
    'Mapa não pode voltar ao header isolado',
  );
});

test('App Shell mantém sidebar, toolbar e rail como zonas independentes', () => {
  const shell = read(
    '../src/shared/layout/territory-app-shell.tsx',
  );

  assert.match(shell, /styles\.sidebar/);
  assert.match(shell, /styles\.desktopTopbar/);
  assert.match(shell, /styles\.contextRail/);
  assert.match(shell, /activeTerritoryNavigation/);
});
