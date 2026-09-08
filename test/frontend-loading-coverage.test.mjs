import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function read(path) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('Busca e Menu possuem loading states próprios', () => {
  const searchLoading = read('../src/app/buscar/loading.tsx');
  const searchCss = read('../src/app/buscar/loading.module.css');
  const menuLoading = read('../src/app/menu/loading.tsx');
  const menuCss = read('../src/app/menu/loading.module.css');

  assert.match(searchLoading, /TerritoryAppShell/);
  assert.match(searchLoading, /Carregando busca/);
  assert.match(menuLoading, /Carregando menu/);
  assert.match(searchCss, /prefers-reduced-motion/);
  assert.match(menuCss, /prefers-reduced-motion/);
});
