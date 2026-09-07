import {
  htmlHasNoindex,
  isRedirectToRoot,
  normalizeBaseUrl,
  sitemapPaths,
  summarizeMapPayload,
} from './territory-release-smoke-core.mjs';

const BASE_URL = normalizeBaseUrl(process.env.BASE_URL);
const EXPECT_PUBLIC =
  process.env.EXPECT_TERRITORY_PUBLIC === '1';

const COMPLEXO_BOUNDS = {
  west: -38.4873837606422,
  south: -13.0134576151743,
  east: -38.4668939364098,
  north: -12.9958446983238,
};

const neighborhoods = [
  ['nordeste-de-amaralina', 'Nordeste de Amaralina'],
  ['santa-cruz', 'Santa Cruz'],
  ['vale-das-pedrinhas', 'Vale das Pedrinhas'],
  ['chapada-do-rio-vermelho', 'Chapada do Rio Vermelho'],
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(path, init = {}) {
  return fetch(new URL(path, `${BASE_URL}/`), {
    ...init,
    signal: AbortSignal.timeout(15_000),
  });
}

async function expectHtml(path, expectedText) {
  const response = await request(path);
  const html = await response.text();

  assert(
    response.status === 200,
    `${path}: HTTP ${response.status}`,
  );
  assert(
    html.includes(expectedText),
    `${path}: texto esperado ausente: ${expectedText}`,
  );

  const hasNoindex = htmlHasNoindex(html);
  assert(
    EXPECT_PUBLIC ? !hasNoindex : hasNoindex,
    `${path}: política robots inesperada`,
  );

  return { response, html };
}

function assertSecurityHeaders(response) {
  assert(
    response.headers.get('x-content-type-options') ===
      'nosniff',
    'header X-Content-Type-Options inválido',
  );
  assert(
    response.headers.get('referrer-policy') ===
      'strict-origin-when-cross-origin',
    'header Referrer-Policy inválido',
  );
  assert(
    response.headers.get('x-frame-options') === 'DENY',
    'header X-Frame-Options inválido',
  );
  assert(
    !response.headers.has('x-powered-by'),
    'X-Powered-By não deve estar presente',
  );

  const csp =
    response.headers.get('content-security-policy') ?? '';
  for (const directive of [
    "default-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'https://tiles.openfreemap.org',
  ]) {
    assert(
      csp.includes(directive),
      `CSP sem diretiva/origem esperada: ${directive}`,
    );
  }

  assert(
    response.headers.get('strict-transport-security') ===
      'max-age=31536000',
    'HSTS ausente ou inesperado',
  );
}

async function run() {
  const healthResponse = await request('/api/health');
  const health = await healthResponse.json();

  assert(
    healthResponse.status === 200,
    `health: HTTP ${healthResponse.status}`,
  );
  assert(
    health.status === 'ok' &&
      health.database === 'ok' &&
      health.territory === 'ok' &&
      health.classifieds === 'ok',
    'health contract não está totalmente saudável',
  );
  assertSecurityHeaders(healthResponse);
  console.log('PASS health + security headers');

  const robotsResponse = await request('/robots.txt');
  const robots = await robotsResponse.text();
  assert(robotsResponse.status === 200, 'robots.txt indisponível');
  for (const rule of [
    'Disallow: /api/',
    'Disallow: /auth/',
    'Disallow: /menu',
    'Disallow: /admin/',
  ]) {
    assert(
      robots.includes(rule),
      `robots.txt sem ${rule}`,
    );
  }
  console.log('PASS robots.txt');

  const loginResponse = await request('/entrar');
  assert(
    loginResponse.status === 200,
    `/entrar: HTTP ${loginResponse.status}`,
  );
  const loginCacheControl =
    loginResponse.headers.get('cache-control') ?? '';
  assert(
    loginCacheControl.includes('private') &&
      loginCacheControl.includes('no-store'),
    `/entrar sem Cache-Control privado/no-store: ${loginCacheControl}`,
  );
  console.log('PASS protected route no-store');

  const sitemapResponse = await request('/sitemap.xml');
  const sitemap = await sitemapResponse.text();
  assert(
    sitemapResponse.status === 200,
    'sitemap.xml indisponível',
  );
  const paths = sitemapPaths(sitemap);
  assert(
    paths.includes('/classificados'),
    'sitemap sem Classificados',
  );
  assert(
    EXPECT_PUBLIC
      ? paths.includes('/') && paths.includes('/mapa')
      : !paths.includes('/') && !paths.includes('/mapa'),
    'sitemap não corresponde ao rollout esperado',
  );
  console.log('PASS sitemap rollout policy');

  await expectHtml(
    '/',
    'Complexo do Nordeste de Amaralina',
  );
  for (const [slug, label] of neighborhoods) {
    await expectHtml(
      `/?bairro=${encodeURIComponent(slug)}`,
      label,
    );
  }
  await expectHtml('/mapa', 'Mapa');
  console.log('PASS Home Complexo + 4 bairros + Mapa');

  for (const path of [
    '/?bairro=../admin',
    '/?bairro=pituba',
  ]) {
    const response = await request(path, {
      redirect: 'manual',
    });

    assert(
      isRedirectToRoot(
        response.status,
        response.headers.get('location'),
        BASE_URL,
      ),
      `${path}: deveria redirecionar para /`,
    );
  }
  console.log('PASS redirects territoriais inválidos');

  const validParams = new URLSearchParams({
    west: String(COMPLEXO_BOUNDS.west),
    south: String(COMPLEXO_BOUNDS.south),
    east: String(COMPLEXO_BOUNDS.east),
    north: String(COMPLEXO_BOUNDS.north),
    zoom: '14',
    layers: 'boundaries,public_places',
    categories: 'education,health',
  });
  const mapResponse = await request(
    `/api/map/viewport?${validParams}`,
  );
  const mapPayload = await mapResponse.json();
  assert(
    mapResponse.status === 200,
    `Map API válida: HTTP ${mapResponse.status}`,
  );

  const summary = summarizeMapPayload(mapPayload);
  assert(
    summary.boundaryCount === 4 &&
      summary.pointCount === 20 &&
      summary.educationCount === 14 &&
      summary.healthCount === 6,
    `Map baseline inesperado: ${JSON.stringify(summary)}`,
  );
  console.log(
    'PASS Map API baseline 4 boundaries / 14 escolas / 6 SUS',
  );

  const wideParams = new URLSearchParams({
    west: '-40',
    south: '-14',
    east: '-37',
    north: '-12',
    zoom: '10',
    layers: 'boundaries,public_places',
  });
  const wideResponse = await request(
    `/api/map/viewport?${wideParams}`,
  );
  const widePayload = await wideResponse.json();
  assert(
    wideResponse.status === 400 &&
      widePayload.error === 'map_bbox_too_large',
    'Map API não rejeitou bbox amplo',
  );

  const categories = [
    'a','b','c','d','e','f','g','h','i','j','k',
  ].join(',');
  const categoryParams = new URLSearchParams({
    west: String(COMPLEXO_BOUNDS.west),
    south: String(COMPLEXO_BOUNDS.south),
    east: String(COMPLEXO_BOUNDS.east),
    north: String(COMPLEXO_BOUNDS.north),
    zoom: '14',
    layers: 'public_places',
    categories,
  });
  const categoryResponse = await request(
    `/api/map/viewport?${categoryParams}`,
  );
  assert(
    categoryResponse.status === 400,
    'Map API não rejeitou categorias em excesso',
  );
  console.log('PASS Map API abuse guards');

  const signoutResponse = await request('/auth/signout', {
    method: 'POST',
    redirect: 'manual',
  });
  assert(
    signoutResponse.status === 403,
    'signout sem Origin deveria retornar 403',
  );

  const trustedSignoutResponse = await request('/auth/signout', {
    method: 'POST',
    redirect: 'manual',
    headers: {
      Origin: BASE_URL,
    },
  });
  assert(
    [302, 303, 307, 308].includes(
      trustedSignoutResponse.status,
    ),
    `signout com Origin do candidato deveria redirecionar, recebeu ${trustedSignoutResponse.status}`,
  );
  const trustedSignoutLocation =
    trustedSignoutResponse.headers.get('location');
  assert(
    trustedSignoutLocation &&
      new URL(
        trustedSignoutLocation,
        BASE_URL,
      ).pathname === '/',
    'signout com Origin confiável deveria redirecionar para /',
  );
  console.log('PASS auth signout origin guard + current deployment origin');

  console.log(
    `SMOKE PASS ${BASE_URL} public=${EXPECT_PUBLIC ? 'yes' : 'no'}`,
  );
}

run().catch((error) => {
  console.error(
    'SMOKE FAIL',
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
