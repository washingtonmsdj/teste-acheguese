import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/database.types';
import { requireSupabasePublicConfig } from '@/lib/supabase/config';

export function createSupabaseBrowserClient() {
  const { url, publishableKey } = requireSupabasePublicConfig();

  return createBrowserClient<Database>(url, publishableKey);
}
