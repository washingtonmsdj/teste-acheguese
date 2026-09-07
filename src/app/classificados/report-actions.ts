'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const validReasons = new Set([
  'fraud',
  'prohibited',
  'duplicate',
  'wrong_category',
  'harassment',
  'other',
]);

export async function reportClassifiedAction(
  classifiedId: string,
  slug: string,
  formData: FormData,
) {
  const next = `/classificados/anuncio/${slug}`;

  if (!getSupabasePublicConfig()) {
    redirect(`/entrar?erro=indisponivel&next=${encodeURIComponent(next)}`);
  }

  const reason =
    typeof formData.get('reason') === 'string'
      ? String(formData.get('reason'))
      : '';
  const details =
    typeof formData.get('details') === 'string'
      ? String(formData.get('details')).trim()
      : '';

  if (
    !validReasons.has(reason) ||
    details.length > 2000
  ) {
    redirect(`${next}?erro=denuncia_invalida`);
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const reporterId = claimsData?.claims?.sub;

  if (typeof reporterId !== 'string') {
    redirect(`/entrar?next=${encodeURIComponent(next)}`);
  }

  const { error } = await supabase
    .from('classified_reports')
    .insert({
      classified_id: classifiedId,
      reporter_id: reporterId,
      reason,
      details: details || null,
    });

  if (error) {
    if (error.code === '23505') {
      redirect(`${next}?denuncia=ja_enviada`);
    }

    redirect(`${next}?erro=denuncia_falhou`);
  }

  revalidatePath('/admin/classificados');
  redirect(`${next}?denuncia=enviada`);
}
