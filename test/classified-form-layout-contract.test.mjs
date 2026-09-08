import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function read(path) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

const expectedFields = [
  'name="title"',
  'name="categoryId"',
  'name="price"',
  'name="condition"',
  'name="description"',
  'name="cityId"',
  'name="neighborhood"',
];

test('novo e editar preservam contratos de campos e agrupam a UX', () => {
  const pages = [
    read('../src/app/classificados/novo/page.tsx'),
    read('../src/app/classificados/[id]/editar/page.tsx'),
  ];

  for (const source of pages) {
    for (const field of expectedFields) {
      assert.equal(
        source.includes(field),
        true,
        'campo obrigatório perdido: ' + field,
      );
    }

    assert.equal(source.includes('classifiedFormSection'), true);
    assert.equal(source.includes('Localização informada'), true);
  }
});

test('novo anúncio mantém fluxo rascunho, fotos e revisão', () => {
  const source = read('../src/app/classificados/novo/page.tsx');

  assert.equal(source.includes('Dados do anúncio'), true);
  assert.equal(source.includes('Fotos'), true);
  assert.equal(source.includes('Revisão'), true);
  assert.equal(source.includes('Salvar rascunho'), true);
  assert.equal(source.includes('createClassifiedDraftAction'), true);
});

test('editar anúncio preserva action e bloqueio por estado', () => {
  const source = read(
    '../src/app/classificados/[id]/editar/page.tsx',
  );

  assert.equal(source.includes('action={updateAction}'), true);
  assert.equal(source.includes('disabled={!editable}'), true);
  assert.equal(source.includes('submitForReviewAction'), true);
});
