import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function read(path) {
  return readFileSync(
    new URL(path, import.meta.url),
    'utf8',
  );
}

test('áreas pessoais usam o rail canônico', () => {
  const surfaces = [
    '../src/app/favoritos/page.tsx',
    '../src/app/mensagens/page.tsx',
    '../src/app/mensagens/[id]/page.tsx',
    '../src/app/classificados/meus/page.tsx',
    '../src/app/classificados/novo/page.tsx',
    '../src/app/classificados/[id]/editar/page.tsx',
  ];

  for (const relativePath of surfaces) {
    const source = read(relativePath);
    assert.match(
      source,
      /AccountContextRail/,
      `${relativePath} precisa usar AccountContextRail`,
    );
  }
});

test('Auth legado não pode voltar a sobrescrever o visual atual', () => {
  const css = read('../src/app/globals.css');

  assert.equal(
    css.includes('.authCardWide {'),
    false,
    'bloco authCardWide legado deve permanecer removido',
  );
});
