import { getSiteUrl } from '@/lib/site-url';

const LOCAL_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '[::1]',
]);

export function getTrustedAuthOrigin(
  requestOrigin: string | null,
) {
  const siteUrl = getSiteUrl();

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

export function isTrustedAuthCallbackOrigin(
  requestOrigin: string,
) {
  const siteUrl = getSiteUrl();

  if (!siteUrl) {
    return true;
  }

  return requestOrigin === siteUrl;
}
