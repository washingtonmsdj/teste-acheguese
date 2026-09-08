import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(
  new URL('../src/app/classificados/page.tsx', import.meta.url),
  'utf8',
);
const card = readFileSync(
  new URL(
    '../src/modules/classifieds/components/classified-card.tsx',
    import.meta.url,
  ),
  'utf8',
);

test('Classificados público usa copy orientada a tarefa', () => {
  assert.equal(page.includes('Classificados locais'), true);
  assert.equal(page.includes('Encontre e anuncie'), true);
  assert.equal(page.includes('Comece por um rascunho'), true);
  assert.equal(page.includes('sem tirar o território do centro'), false);
});

test('card mantém destino e explicita condição, local e ação', () => {
  assert.equal(card.includes('publicClassifiedCondition'), true);
  assert.equal(card.includes('publicClassifiedLocation'), true);
  assert.equal(card.includes('publicClassifiedAction'), true);
  assert.equal(card.includes('/classificados/anuncio/'), true);
});
