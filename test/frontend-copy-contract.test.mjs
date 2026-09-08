import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const publicSurfacePaths = [
  '../src/features/territory-home/components/territory-home.tsx',
  '../src/app/error.tsx',
  '../src/app/not-found.tsx',
  '../src/app/menu/page.tsx',
];

const forbiddenPhrases = [
  'primeiro vertical',
  'vertical já disponível',
  'o resto vem depois',
  'zero conteúdo social fictício',
  'a utilidade começa antes do feed',
  'erro poderá ser rastreado pela observabilidade',
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
