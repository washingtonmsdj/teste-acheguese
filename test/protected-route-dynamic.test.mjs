import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const protectedPages = [
  'src/app/admin/classificados/page.tsx',
  'src/app/classificados/[id]/editar/page.tsx',
  'src/app/classificados/meus/page.tsx',
  'src/app/classificados/novo/page.tsx',
  'src/app/favoritos/page.tsx',
  'src/app/mensagens/page.tsx',
  'src/app/mensagens/[id]/page.tsx',
];

test('superfícies pessoais/admin são sempre renderizadas dinamicamente', () => {
  for (const path of protectedPages) {
    const source = readFileSync(
      new URL(`../${path}`, import.meta.url),
      'utf8',
    );

    assert.match(
      source,
      /export const dynamic = ['"]force-dynamic['"];/,
      `${path} deve permanecer force-dynamic`,
    );
  }
});

test('configuração de headers privados cobre as superfícies autenticadas', () => {
  const config = readFileSync(
    new URL('../next.config.ts', import.meta.url),
    'utf8',
  );

  const routes = [
    '/admin/:path*',
    '/auth/:path*',
    '/entrar',
    '/classificados/meus',
    '/classificados/novo',
    '/classificados/:id/editar',
    '/favoritos',
    '/mensagens/:path*',
  ];

  for (const route of routes) {
    assert.equal(
      config.includes(route),
      true,
      route + ' deve permanecer na política private/no-store',
    );
  }

  assert.equal(
    config.includes(
      'private, no-store, max-age=0, must-revalidate',
    ),
    true,
  );
});
