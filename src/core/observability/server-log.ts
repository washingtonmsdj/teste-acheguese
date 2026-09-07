export type ServerLogContextValue =
  | string
  | number
  | boolean
  | null;

export type ServerLogContext = Record<
  string,
  ServerLogContextValue
>;

const SECRET_PATTERNS = [
  /sb_(?:secret|publishable)_[A-Za-z0-9_-]+/g,
  /eyJ[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{8,}/g,
  /postgres(?:ql)?:\/\/[^\s@]+@/gi,
] as const;

function cleanText(
  value: string,
  maxLength: number,
): string {
  let result = value.replace(/\s+/g, ' ').trim();

  for (const pattern of SECRET_PATTERNS) {
    result = result.replace(pattern, '[redacted]');
  }

  return result.slice(0, maxLength);
}

function sanitizeContext(
  context: ServerLogContext,
): ServerLogContext {
  const safe: ServerLogContext = {};

  for (const [key, value] of Object.entries(context)) {
    if (!/^[a-zA-Z0-9_.-]{1,48}$/.test(key)) {
      continue;
    }

    safe[key] =
      typeof value === 'string'
        ? cleanText(value, 120)
        : value;
  }

  return safe;
}

export function buildServerErrorEvent(
  event: string,
  error: unknown,
  context: ServerLogContext = {},
) {
  const safeEvent = /^[a-z0-9_.-]{1,80}$/.test(event)
    ? event
    : 'server.error';

  return {
    level: 'error' as const,
    event: safeEvent,
    errorName:
      error instanceof Error
        ? cleanText(error.name || 'Error', 80)
        : 'UnknownError',
    message:
      error instanceof Error
        ? cleanText(error.message || 'unknown_error', 240)
        : 'unknown_error',
    context: sanitizeContext(context),
  };
}

export function reportServerError(
  event: string,
  error: unknown,
  context: ServerLogContext = {},
) {
  console.error(
    '[acheguese]',
    JSON.stringify(
      buildServerErrorEvent(event, error, context),
    ),
  );
}
