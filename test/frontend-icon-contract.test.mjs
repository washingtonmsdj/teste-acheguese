import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function read(path) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('Classificados usa ícones do sistema em ações e placeholders', () => {
  const detail = read(
    '../src/app/classificados/anuncio/[slug]/page.tsx',
  );
  const card = read(
    '../src/modules/classifieds/components/classified-card.tsx',
  );

  assert.equal(detail.includes('♡'), false);
  assert.equal(card.includes('▧'), false);
  assert.match(detail, /NavigationIcon name="favorite"/);
  assert.match(card, /NavigationIcon name="tag"/);
});

test('conversa acompanha a altura canônica do topbar', () => {
  const css = read('../src/app/globals.css');

  assert.equal(css.includes('calc(100svh - 76px)'), false);
  assert.match(css, /calc\(100svh - 74px\)/);
});
