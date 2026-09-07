const LOCAL_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '[::1]',
]);

export function trustedAuthOrigin(
  siteUrl: string | null,
  requestOrigin: string | null,
) {
  if (siteUrl) {
    return siteUrl;
  }

  if (!requestOrigin) return null;

  try {
    const url = new URL(requestOrigin);

    if (
      url.protocol === 'http:' &&
      LOCAL_HOSTS.has(url.hostname)
    ) {
      return url.origin;
    }
  } catch {
    return null;
  }

  return null;
}

export function trustedAuthCallbackOrigin(
  siteUrl: string | null,
  requestOrigin: string,
) {
  return trustedAuthOrigin(siteUrl, requestOrigin) === requestOrigin;
}
