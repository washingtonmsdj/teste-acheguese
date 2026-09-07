import { getSiteUrl } from '@/lib/site-url';
import {
  trustedAuthCallbackOrigin,
  trustedAuthOrigin,
} from '@/lib/auth/origin-core';

export function getTrustedAuthOrigin(
  requestOrigin: string | null,
) {
  return trustedAuthOrigin(
    getSiteUrl(),
    requestOrigin,
  );
}

export function isTrustedAuthCallbackOrigin(
  requestOrigin: string,
) {
  return trustedAuthCallbackOrigin(
    getSiteUrl(),
    requestOrigin,
  );
}

export function isTrustedAuthRequestOrigin(
  requestOrigin: string | null,
) {
  return Boolean(
    requestOrigin &&
      trustedAuthCallbackOrigin(
        getSiteUrl(),
        requestOrigin,
      ),
  );
}
