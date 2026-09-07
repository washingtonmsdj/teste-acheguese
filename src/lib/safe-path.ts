const INTERNAL_BASE = 'https://acheguese.invalid';

export function safeInternalPath(
  value: unknown,
  fallback = '/',
) {
  if (typeof value !== 'string') return fallback;

  const candidate = value.trim();

  if (
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    candidate.includes('\\')
  ) {
    return fallback;
  }

  try {
    const url = new URL(candidate, INTERNAL_BASE);

    if (url.origin !== INTERNAL_BASE) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
