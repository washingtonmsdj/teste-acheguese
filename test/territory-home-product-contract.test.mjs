import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const home = readFileSync(
  new URL(
    '../src/features/territory-home/components/territory-home.tsx',
    import.meta.url,
  ),
  'utf8',
);
const css = readFileSync(
  new URL(
    '../src/features/territory-home/components/territory-home.module.css',
    import.meta.url,
  ),
  'utf8',
);

test('Home mantém o mapa como protagonista do MVP', () => {
  assert.match(home, /TerritoryMiniMap/);
  assert.match(home, /Território Vivo/);
  assert.match(home, /Explorar mapa/);
  assert.match(css, /@media \(min-width: 1180px\)/);
  assert.match(
    css,
    /grid-template-columns: minmax\(0, 1\.02fr\) minmax\(360px, \.88fr\)/,
  );
});

test('Home não expõe rollout como badge principal', () => {
  assert.equal(
    home.includes('className={styles.stageBadge}'),
    false,
  );
  assert.equal(css.includes('.stageBadge {'), false);
});

test('Home mantém Classificados como utilidade local', () => {
  assert.match(home, /Classificados locais/);
  assert.match(home, /Compre e venda perto de você\./);
});
