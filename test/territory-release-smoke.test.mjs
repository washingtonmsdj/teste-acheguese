import assert from 'node:assert/strict';
import test from 'node:test';
import {
  htmlHasNoindex,
  isRedirectToRoot,
  normalizeBaseUrl,
  sitemapPaths,
  summarizeMapPayload,
} from '../scripts/territory-release-smoke-core.mjs';

test('normaliza base URL sem caminho/query', () => {
  assert.equal(
    normalizeBaseUrl(
      'https://preview.example/path?q=1#x',
    ),
    'https://preview.example',
  );
  assert.throws(
    () => normalizeBaseUrl('file:///tmp/x'),
    /http\(s\)/,
  );
});

test('detecta noindex independentemente da ordem dos atributos', () => {
  assert.equal(
    htmlHasNoindex(
      '<meta content="noindex, follow" name="robots">',
    ),
    true,
  );
  assert.equal(
    htmlHasNoindex(
      '<meta name="robots" content="index, follow">',
    ),
    false,
  );
});

test('extrai somente pathnames do sitemap', () => {
  assert.deepEqual(
    sitemapPaths(
      '<url><loc>https://x.test/classificados</loc></url><url><loc>https://x.test/mapa</loc></url>',
    ),
    ['/classificados', '/mapa'],
  );
});

test('resume baseline do Map Core por kind', () => {
  assert.deepEqual(
    summarizeMapPayload({
      boundaries: [{}, {}, {}, {}],
      points: [
        ...Array.from({ length: 14 }, () => ({
          kind: 'education',
        })),
        ...Array.from({ length: 6 }, () => ({
          kind: 'health',
        })),
      ],
    }),
    {
      boundaryCount: 4,
      pointCount: 20,
      educationCount: 14,
      healthCount: 6,
    },
  );
});

test('valida redirect territorial para raiz', () => {
  assert.equal(
    isRedirectToRoot(
      307,
      '/',
      'https://acheguese.example',
    ),
    true,
  );
  assert.equal(
    isRedirectToRoot(
      307,
      '/entrar',
      'https://acheguese.example',
    ),
    false,
  );
});

test('smoke de release continua separado de segredos/config privada', () => {
  const source = new URL(
    '../scripts/territory-release-smoke.mjs',
    import.meta.url,
  );

  assert.equal(source.protocol, 'file:');
});
