export type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
};

export function parseSupabasePublicConfig(
  urlValue: string | undefined,
  publishableKeyValue: string | undefined,
): SupabasePublicConfig | null {
  const rawUrl = urlValue?.trim();
  const publishableKey = publishableKeyValue?.trim();

  if (!rawUrl || !publishableKey) {
    return null;
  }

  try {
    const url = new URL(rawUrl);

    if (
      (url.protocol !== 'https:' &&
        url.protocol !== 'http:') ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      return null;
    }

    return {
      url: url.toString().replace(/\/$/, ''),
      publishableKey,
    };
  } catch {
    return null;
  }
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
