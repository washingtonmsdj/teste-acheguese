import assert from 'node:assert/strict';
import {
  existsSync,
  readdirSync,
  readFileSync,
} from 'node:fs';
import test from 'node:test';

function read(relativePath) {
  return readFileSync(
    new URL(relativePath, import.meta.url),
    'utf8',
  );
}

test('superfícies públicas principais usam o Territory App Shell canônico', () => {
  const home = read(
    '../src/features/territory-home/components/territory-home.tsx',
  );
  const map = read('../src/app/mapa/page.tsx');
  const loading = read('../src/app/loading.tsx');
  const mapLoading = read('../src/app/mapa/loading.tsx');
  const classifieds = read('../src/app/classificados/page.tsx');
  const classifiedsLoading = read('../src/app/classificados/loading.tsx');
  const classifiedDetail = read(
    '../src/app/classificados/anuncio/[slug]/page.tsx',
  );
  const search = read('../src/app/buscar/page.tsx');

  for (const [name, source] of [
    ['home', home],
    ['map', map],
    ['home loading', loading],
    ['map loading', mapLoading],
    ['classifieds', classifieds],
    ['classifieds loading', classifiedsLoading],
    ['classified detail', classifiedDetail],
    ['search', search],
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

  for (const [name, source] of [
    ['classifieds', classifieds],
    ['classified detail', classifiedDetail],
    ['search', search],
  ]) {
    assert.equal(
      source.includes('<SiteHeader'),
      false,
      `${name} não pode voltar ao header isolado`,
    );
    assert.equal(
      source.includes('<MobileTabbar'),
      false,
      `${name} não pode manter tabbar paralela ao App Shell`,
    );
  }
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


function collectPageFiles(directoryUrl) {
  const entries = readdirSync(directoryUrl, {
    withFileTypes: true,
  });
  const pages = [];

  for (const entry of entries) {
    const child = new URL(
      `${entry.name}${entry.isDirectory() ? '/' : ''}`,
      directoryUrl,
    );

    if (entry.isDirectory()) {
      pages.push(...collectPageFiles(child));
      continue;
    }

    if (entry.name === 'page.tsx') {
      pages.push(child);
    }
  }

  return pages;
}

test('nenhuma página pode recriar navegação paralela ao App Shell', () => {
  const appRoot = new URL('../src/app/', import.meta.url);
  const pages = collectPageFiles(appRoot);

  for (const pageUrl of pages) {
    const source = readFileSync(pageUrl, 'utf8');

    assert.equal(
      source.includes("shared/layout/site-header"),
      false,
      `${pageUrl.pathname} não pode importar SiteHeader legado`,
    );
    assert.equal(
      source.includes("shared/layout/mobile-tabbar"),
      false,
      `${pageUrl.pathname} não pode importar MobileTabbar diretamente`,
    );
  }

  assert.equal(
    existsSync(
      new URL(
        '../src/shared/layout/site-header.tsx',
        import.meta.url,
      ),
    ),
    false,
    'SiteHeader legado deve permanecer removido',
  );
});


test('App Shell preserva contexto territorial no tablet sem duplicar header', () => {
  const shell = read(
    '../src/shared/layout/territory-app-shell.tsx',
  );
  const css = read(
    '../src/shared/layout/territory-app-shell.module.css',
  );

  assert.match(shell, /styles\.mobileTerritory/);
  assert.match(css, /@media \(min-width: 640px\) and \(max-width: 979px\)/);
  assert.match(css, /env\(safe-area-inset-top\)/);
});
