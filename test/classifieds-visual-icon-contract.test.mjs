import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function read(path) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('estados vazios e trust badges usam o sistema de ícones', () => {
  const empty = read(
    '../src/modules/classifieds/components/empty-state.tsx',
  );
  const classifieds = read('../src/app/classificados/page.tsx');

  assert.equal(empty.includes('⌕'), false);
  assert.equal(classifieds.includes('<span>✓</span>'), false);
  assert.match(empty, /NavigationIcon name="search"/);
  assert.match(classifieds, /NavigationIcon name="check"/);
});
