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

export function vercelDeploymentOrigin(
  vercelMarker: string | undefined,
  vercelUrl: string | undefined,
) {
  if (vercelMarker !== '1' || !vercelUrl?.trim()) {
    return null;
  }

  const hostname = vercelUrl.trim().toLowerCase();

  if (
    hostname.includes('/') ||
    hostname.includes(':') ||
    !hostname.endsWith('.vercel.app')
  ) {
    return null;
  }

  return exactOrigin(`https://${hostname}`);
}

export function trustedAuthOrigin(
  siteUrl: string | null,
  deploymentOrigin: string | null,
  requestOrigin: string | null,
) {
  const origin = exactOrigin(requestOrigin);

  if (!origin) return null;

  if (
    origin === siteUrl ||
    origin === deploymentOrigin
  ) {
    return origin;
  }

  if (siteUrl || deploymentOrigin) {
    return null;
  }

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
  deploymentOrigin: string | null,
  requestOrigin: string,
) {
  return trustedAuthOrigin(
    siteUrl,
    deploymentOrigin,
    requestOrigin,
  ) === requestOrigin;
}
