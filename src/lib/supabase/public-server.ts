import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import { getSupabasePublicConfig } from '@/lib/supabase/config';

export function createSupabasePublicServerClient() {
  const config = getSupabasePublicConfig();

  if (!config) {
    return null;
  }

  return createClient<Database>(
    config.url,
    config.publishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
