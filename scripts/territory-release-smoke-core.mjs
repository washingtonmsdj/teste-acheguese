export function normalizeBaseUrl(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('BASE_URL obrigatório');
  }

  const url = new URL(value.trim());

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('BASE_URL deve usar http(s)');
  }

  url.pathname = '/';
  url.search = '';
  url.hash = '';

  return url.toString().replace(/\/$/, '');
}

const CANONICAL_VERCEL_HOSTS = new Set([
  'teste-acheguese.vercel.app',
  'teste-acheguese-jogo-brasils-projects.vercel.app',
]);

const CANONICAL_VERCEL_PREVIEW_HOST =
  /^teste-acheguese-[a-z0-9]+-jogo-brasils-projects\.vercel\.app$/;

export function assertProtectedQaTarget(baseUrl) {
  const normalized = normalizeBaseUrl(baseUrl);
  const url = new URL(normalized);
  const allowedHost =
    CANONICAL_VERCEL_HOSTS.has(url.hostname) ||
    CANONICAL_VERCEL_PREVIEW_HOST.test(url.hostname);

  if (url.protocol !== 'https:' || !allowedHost) {
    throw new Error(
      'Credencial de QA protegido só pode ser enviada ao projeto Vercel canônico',
    );
  }

  return normalized;
}

export function buildTrustedOidcHeaders(
  headersInit,
  token,
) {
  const headers = new Headers(headersInit);
  const value =
    typeof token === 'string' ? token.trim() : '';

  if (value) {
    headers.set('x-vercel-trusted-oidc-idp-token', value);
  }

  return headers;
}

function readAttribute(tag, name) {
  const match = tag.match(
    new RegExp(
      `\\b${name}\\s*=\\s*["']([^"']*)["']`,
      'i',
    ),
  );

  return match?.[1] ?? null;
}

export function htmlHasNoindex(html) {
  const tags = String(html).match(/<meta\b[^>]*>/gi) ?? [];

  return tags.some((tag) => {
    const name = readAttribute(tag, 'name');
    const content = readAttribute(tag, 'content');

    return (
      name?.toLowerCase() === 'robots' &&
      content
        ?.toLowerCase()
        .split(',')
        .map((item) => item.trim())
        .includes('noindex')
    );
  });
}

export function sitemapPaths(xml) {
  const urls = [
    ...String(xml).matchAll(
      /<loc>\s*([^<]+)\s*<\/loc>/gi,
    ),
  ].map((match) => match[1]);

  return urls.map((value) => {
    try {
      return new URL(value).pathname;
    } catch {
      return 'invalid-url';
    }
  });
}

export function summarizeMapPayload(payload) {
  const boundaries = Array.isArray(payload?.boundaries)
    ? payload.boundaries
    : [];
  const points = Array.isArray(payload?.points)
    ? payload.points
    : [];

  return {
    boundaryCount: boundaries.length,
    pointCount: points.length,
    educationCount: points.filter(
      (point) => point?.kind === 'education',
    ).length,
    healthCount: points.filter(
      (point) => point?.kind === 'health',
    ).length,
  };
}

export function isRedirectToRoot(
  status,
  location,
  baseUrl,
) {
  if (![301, 302, 303, 307, 308].includes(status)) {
    return false;
  }

  if (!location) return false;

  try {
    const url = new URL(location, baseUrl);
    return url.pathname === '/' && !url.search;
  } catch {
    return false;
  }
}
