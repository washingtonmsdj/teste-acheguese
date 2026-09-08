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
const loading = readFileSync(
  new URL('../src/app/loading.tsx', import.meta.url),
  'utf8',
);
const globals = readFileSync(
  new URL('../src/app/globals.css', import.meta.url),
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


test('loading acompanha a composição responsiva da Home', () => {
  assert.match(loading, /contextRail=/);
  assert.match(loading, /loadingContextRail/);
  assert.match(
    globals,
    /@media \(min-width: 1180px\) \{\n  \.loadingHeroLayout/,
  );
  assert.equal(
    globals.includes(
      '@media (min-width: 980px) {\n  .loadingHeroLayout',
    ),
    false,
  );
});


test('Home monta mini-mapa sem segunda leitura RPC', () => {
  const loader = readFileSync(
    new URL(
      '../src/features/territory-home/server/load-territory-home.ts',
      import.meta.url,
    ),
    'utf8',
  );

  assert.equal(
    loader.includes('SupabaseMapDataRepository'),
    false,
  );
  assert.match(loader, /buildHomeMapData/);
  assert.match(loader, /places\.flatMap/);
});

test('fallback mantém a estrutura territorial sem linguagem interna', () => {
  assert.match(
    home,
    /Os dados públicos estão temporariamente indisponíveis\./,
  );
  assert.equal(home.includes('MVP territorial'), false);
  assert.equal(home.includes('Estrutura do MVP'), false);
  assert.equal(home.includes('Fundação do MVP'), false);
  assert.match(home, /Nordeste de Amaralina/);
  assert.match(home, /Santa Cruz/);
  assert.match(home, /Vale das Pedrinhas/);
  assert.match(home, /Chapada do Rio Vermelho/);
  assert.match(home, /População e domicílios/);
  assert.match(home, /Atendimento SUS/);
});

test('configuração pública é congelada no bundle de build', () => {
  const nextConfig = readFileSync(
    new URL('../next.config.ts', import.meta.url),
    'utf8',
  );

  assert.match(nextConfig, /env:\s*\{/);
  assert.match(nextConfig, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(
    nextConfig,
    /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/,
  );
});
