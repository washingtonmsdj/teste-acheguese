import { getSiteUrl } from '@/lib/site-url';
import {
  trustedAuthCallbackOrigin,
  trustedAuthOrigin,
  vercelDeploymentOrigin,
} from '@/lib/auth/origin-core';

function getVercelDeploymentOrigin() {
  return vercelDeploymentOrigin(
    process.env.VERCEL,
    process.env.VERCEL_URL,
  );
}

export function getTrustedAuthOrigin(
  requestOrigin: string | null,
) {
  return trustedAuthOrigin(
    getSiteUrl(),
    getVercelDeploymentOrigin(),
    requestOrigin,
  );
}

export function isTrustedAuthCallbackOrigin(
  requestOrigin: string,
) {
  return trustedAuthCallbackOrigin(
    getSiteUrl(),
    getVercelDeploymentOrigin(),
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
        getVercelDeploymentOrigin(),
        requestOrigin,
      ),
  );
}
