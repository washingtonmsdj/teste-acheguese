const LOCAL_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '[::1]',
]);

function exactOrigin(
  value: string | null,
) {
  if (!value) return null;

  try {
    const url = new URL(value);

    return url.origin === value
      ? url.origin
      : null;
  } catch {
    return null;
  }
}

export function trustedAuthOrigin(
  siteUrl: string | null,
  requestOrigin: string | null,
) {
  const origin = exactOrigin(requestOrigin);

  if (siteUrl) {
    return origin === siteUrl
      ? siteUrl
      : null;
  }

  if (!origin) return null;

  const url = new URL(origin);

  if (
    url.protocol === 'http:' &&
    LOCAL_HOSTS.has(url.hostname)
  ) {
    return origin;
  }

  return null;
}

export function trustedAuthCallbackOrigin(
  siteUrl: string | null,
  requestOrigin: string,
) {
  return trustedAuthOrigin(
    siteUrl,
    requestOrigin,
  ) === requestOrigin;
}
