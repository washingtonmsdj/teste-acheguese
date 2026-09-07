import { parseHttpOrigin } from '@/lib/public-url';

export function getSiteUrl() {
  return parseHttpOrigin(
    process.env.NEXT_PUBLIC_SITE_URL,
  );
}
