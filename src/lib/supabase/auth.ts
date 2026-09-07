import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    return null;
  }

  const subject = data?.claims?.sub;

  return typeof subject === 'string' && subject.length > 0
    ? subject
    : null;
}

export async function requireAuthenticatedUserId(): Promise<string> {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    throw new Error('authentication_required');
  }

  return userId;
}
