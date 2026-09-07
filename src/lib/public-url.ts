export function parseHttpOrigin(
  value: string | undefined,
): string | null {
  const raw = value?.trim();

  if (!raw) return null;

  try {
    const url = new URL(raw);

    if (
      (url.protocol !== 'https:' &&
        url.protocol !== 'http:') ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      (url.pathname !== '/' && url.pathname !== '')
    ) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}
