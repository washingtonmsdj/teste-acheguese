import { parseHttpOrigin } from '../public-url.ts';

export type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
};

export function parseSupabasePublicConfig(
  urlValue: string | undefined,
  publishableKeyValue: string | undefined,
): SupabasePublicConfig | null {
  const url = parseHttpOrigin(urlValue);
  const publishableKey = publishableKeyValue?.trim();

  if (!url || !publishableKey) {
    return null;
  }

  return {
    url,
    publishableKey,
  };
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  return parseSupabasePublicConfig(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function requireSupabasePublicConfig(): SupabasePublicConfig {
  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error('supabase_not_configured');
  }

  return config;
}
