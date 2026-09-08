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


test('breakpoint Auth legado de 720px permanece removido', () => {
  const css = read('../src/app/globals.css');

  assert.equal(
    css.includes(
      '@media (min-width: 720px) {\n  .authForms { grid-template-columns: 1fr 1fr; }',
    ),
    false,
    'Auth novo usa seu breakpoint canônico de 760px',
  );
});


test('áreas pessoais possuem loading contextual', () => {
  const loadingFiles = [
    '../src/app/favoritos/loading.tsx',
    '../src/app/mensagens/loading.tsx',
    '../src/app/mensagens/[id]/loading.tsx',
    '../src/app/classificados/meus/loading.tsx',
    '../src/app/classificados/novo/loading.tsx',
    '../src/app/classificados/[id]/editar/loading.tsx',
  ];

  for (const relativePath of loadingFiles) {
    const source = read(relativePath);
    assert.match(
      source,
      /AccountSurfaceLoading/,
      relativePath + ' precisa usar AccountSurfaceLoading',
    );
  }
});


test('área pessoal expõe logout visível usando POST canônico', () => {
  const rail = read('../src/shared/layout/account-context-rail.tsx');
  const control = read('../src/shared/layout/sign-out-control.tsx');

  assert.match(rail, /SignOutControl/);
  assert.match(control, /action="\/auth\/signout"/);
  assert.match(control, /method="post"/);
  assert.match(control, /Sair da conta/);
});
