import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const publicSurfacePaths = [
  '../src/features/territory-home/components/territory-home.tsx',
  '../src/app/error.tsx',
  '../src/app/not-found.tsx',
  '../src/app/menu/page.tsx',
  '../src/app/buscar/page.tsx',
  '../src/app/classificados/page.tsx',
  '../src/app/mapa/page.tsx',
  '../src/app/entrar/page.tsx',
];

const forbiddenPhrases = [
  'primeiro vertical',
  'vertical já disponível',
  'o resto vem depois',
  'zero conteúdo social fictício',
  'a utilidade começa antes do feed',
  'erro poderá ser rastreado pela observabilidade',
  'o mvp começa',
  'categorias futuras',
  'sem fingir localização automática',
  'mvp territorial',
  'estrutura do mvp',
  'fundação do mvp',
  'configuração pública',
  'neste ambiente',
  'demonstração',
];

test('superfícies principais não expõem linguagem interna de implementação', () => {
  for (const path of publicSurfacePaths) {
    const source = readFileSync(
      new URL(path, import.meta.url),
      'utf8',
    ).toLowerCase();

    for (const phrase of forbiddenPhrases) {
      assert.equal(
        source.includes(phrase),
        false,
        `${path} expõe copy interna: ${phrase}`,
      );
    }
  }
});
