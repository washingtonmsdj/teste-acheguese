import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  assertAutomationBypassTarget,
  buildProtectionBypassHeaders,
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


test('limita Protection Bypass ao projeto Vercel canônico', () => {
  assert.equal(
    assertAutomationBypassTarget(
      'https://teste-acheguese-abc123-jogo-brasils-projects.vercel.app/mapa',
    ),
    'https://teste-acheguese-abc123-jogo-brasils-projects.vercel.app',
  );
  assert.equal(
    assertAutomationBypassTarget(
      'https://teste-acheguese.vercel.app',
    ),
    'https://teste-acheguese.vercel.app',
  );
  assert.throws(
    () =>
      assertAutomationBypassTarget(
        'https://preview.example',
      ),
    /projeto Vercel canônico/,
  );
  assert.throws(
    () =>
      assertAutomationBypassTarget(
        'http://teste-acheguese-abc123-jogo-brasils-projects.vercel.app',
      ),
    /projeto Vercel canônico/,
  );
});

test('bypass preserva headers existentes e não existe sem segredo', () => {
  const headers = buildProtectionBypassHeaders(
    { Origin: 'https://teste-acheguese.vercel.app' },
    '  secret-value  ',
  );

  assert.equal(
    headers.get('origin'),
    'https://teste-acheguese.vercel.app',
  );
  assert.equal(
    headers.get('x-vercel-protection-bypass'),
    'secret-value',
  );
  assert.equal(
    headers.get('x-vercel-set-bypass-cookie'),
    'true',
  );

  const publicHeaders =
    buildProtectionBypassHeaders(undefined, '');
  assert.equal(
    publicHeaders.has('x-vercel-protection-bypass'),
    false,
  );
});

test('workflow de smoke protegido é manual e fail-closed', () => {
  const workflow = readFileSync(
    new URL(
      '../.github/workflows/protected-release-smoke.yml',
      import.meta.url,
    ),
    'utf8',
  );

  assert.match(workflow, /workflow_dispatch:/);
  assert.match(
    workflow,
    /VERCEL_AUTOMATION_BYPASS_SECRET:.*secrets\.VERCEL_AUTOMATION_BYPASS_SECRET/,
  );
  assert.match(
    workflow,
    /REQUIRE_VERCEL_PROTECTION_BYPASS:\s*'1'/,
  );
  assert.match(workflow, /persist-credentials:\s*false/);
  assert.doesNotMatch(
    workflow,
    /pull_request_target|repository_dispatch|workflow_run:/,
  );
});
