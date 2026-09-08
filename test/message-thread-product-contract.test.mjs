import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(
  new URL('../src/app/mensagens/[id]/page.tsx', import.meta.url),
  'utf8',
);

test('conversa expõe contexto sem novas queries', () => {
  assert.equal(source.includes('threadContextBar'), true);
  assert.equal(source.includes('messageCount'), true);
  assert.equal(source.includes('isPublished'), true);
  assert.equal(
    (source.match(/from\('classified_conversations'\)/g) ?? []).length,
    1,
  );
  assert.equal(
    (source.match(/from\('classified_messages'\)/g) ?? []).length,
    1,
  );
});

test('composer preserva action e limites canônicos', () => {
  assert.equal(source.includes('action={sendAction}'), true);
  assert.equal(source.includes('minLength={1}'), true);
  assert.equal(source.includes('maxLength={1500}'), true);
  assert.equal(source.includes('sendConversationMessageAction'), true);
});
