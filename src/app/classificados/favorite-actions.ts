'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function safeReturnPath(value: string) {
  if (!value.startsWith('/') || value.startsWith('//')) {
    return '/classificados';
  }

  return value;
}

export async function toggleFavoriteAction(
  classifiedId: string,
  returnPath: string,
) {
  const next = safeReturnPath(returnPath);

  if (!getSupabasePublicConfig()) {
    redirect(`/entrar?erro=indisponivel&next=${encodeURIComponent(next)}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (typeof userId !== 'string') {
    redirect(`/entrar?next=${encodeURIComponent(next)}`);
  }

  const { data: existing, error: lookupError } = await supabase
    .from('classified_favorites')
    .select('classified_id')
    .eq('user_id', userId)
    .eq('classified_id', classifiedId)
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existing) {
    const { error } = await supabase
      .from('classified_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('classified_id', classifiedId);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('classified_favorites')
      .insert({
        user_id: userId,
        classified_id: classifiedId,
      });

    if (error) throw error;
  }

  revalidatePath(next);
  revalidatePath('/favoritos');
  redirect(next);
}
