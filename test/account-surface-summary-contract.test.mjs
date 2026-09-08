import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function read(path) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('superfícies pessoais mostram resumo derivado dos dados já carregados', () => {
  const favorites = read('../src/app/favoritos/page.tsx');
  const messages = read('../src/app/mensagens/page.tsx');
  const mine = read('../src/app/classificados/meus/page.tsx');

  assert.equal(favorites.includes('accountMetricStrip'), true);
  assert.equal(favorites.includes('unavailableCount'), true);

  assert.equal(messages.includes('accountMetricStrip'), true);
  assert.equal(messages.includes('sellerConversationCount'), true);
  assert.equal(messages.includes('buyerConversationCount'), true);

  assert.equal(mine.includes('accountMetricStrip'), true);
  assert.equal(mine.includes('publishedCount'), true);
  assert.equal(mine.includes('reviewCount'), true);
  assert.equal(mine.includes('editableCount'), true);
});

test('resumo de conta não adiciona uma segunda consulta de dados', () => {
  const messages = read('../src/app/mensagens/page.tsx');
  const mine = read('../src/app/classificados/meus/page.tsx');

  assert.equal(
    (messages.match(/from\('classified_conversations'\)/g) ?? []).length,
    1,
  );
  assert.equal(
    (mine.match(/from\('classifieds'\)/g) ?? []).length,
    1,
  );
});
