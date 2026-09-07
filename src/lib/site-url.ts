import { parseHttpOrigin } from './public-url.ts';

export function getSiteUrl() {
  return parseHttpOrigin(
    process.env.NEXT_PUBLIC_SITE_URL,
  );
}
