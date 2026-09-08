import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function read(path) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('categorias mantêm o domínio livre de apresentação', () => {
  const domain = read('../src/modules/classifieds/domain/categories.ts');
  const nav = read('../src/modules/classifieds/components/category-nav.tsx');
  const icon = read('../src/modules/classifieds/components/category-icon.tsx');

  assert.equal(
    domain.includes('icon:'),
    false,
    'ícones pertencem à UI, não ao domínio de categorias',
  );
  assert.match(nav, /ClassifiedCategoryIcon/);

  for (const category of [
    'vehicles',
    'real-estate',
    'electronics',
    'home',
    'fashion',
    'sports',
    'pets',
  ]) {
    assert.match(icon, new RegExp(`category === '${category}'`));
  }
});
