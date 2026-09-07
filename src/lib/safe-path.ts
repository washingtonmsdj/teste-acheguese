const INTERNAL_BASE = 'https://acheguese.invalid';
const UNSAFE_ENCODED_PATH =
  /%(?:2f|5c|0[0-9a-f]|1[0-9a-f]|7f)/i;
const UNSAFE_DECODED_PATH =
  /[\\\u0000-\u001f\u007f]/;

function hasUnsafePathCanonicalization(
  pathname: string,
) {
  let current = pathname;

  for (let pass = 0; pass < 3; pass += 1) {
    if (
      current.startsWith('//') ||
      UNSAFE_ENCODED_PATH.test(current) ||
      UNSAFE_DECODED_PATH.test(current)
    ) {
      return true;
    }

    let decoded: string;

    try {
      decoded = decodeURIComponent(current);
    } catch {
      return true;
    }

    if (decoded === current) {
      return false;
    }

    current = decoded;
  }

  return (
    current.startsWith('//') ||
    UNSAFE_ENCODED_PATH.test(current) ||
    UNSAFE_DECODED_PATH.test(current)
  );
}

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

    if (
      url.origin !== INTERNAL_BASE ||
      hasUnsafePathCanonicalization(url.pathname)
    ) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
