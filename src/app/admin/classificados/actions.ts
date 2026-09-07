'use server';

import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { hasClassifiedAdminRole } from '@/lib/auth/roles';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function requireClassifiedAdmin() {
  if (!getSupabasePublicConfig()) {
    redirect('/');
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!hasClassifiedAdminRole(claimsData?.claims)) {
    notFound();
  }

  return supabase;
}

function readReason(formData: FormData) {
  const value = formData.get('reason');

  if (typeof value !== 'string') return null;

  const reason = value.trim();
  return reason.length >= 10 && reason.length <= 1000
    ? reason
    : null;
}

export async function approveClassifiedAction(classifiedId: string) {
  const supabase = await requireClassifiedAdmin();

  const { data, error } = await supabase
    .from('classifieds')
    .update({
      status: 'published',
      rejection_reason: null,
    })
    .eq('id', classifiedId)
    .eq('status', 'pending_review')
    .select('id')
    .maybeSingle();

  if (error || !data) {
    redirect('/admin/classificados?erro=aprovar');
  }

  revalidatePath('/admin/classificados');
  revalidatePath('/classificados');
  redirect('/admin/classificados?ok=aprovado');
}

export async function rejectClassifiedAction(
  classifiedId: string,
  formData: FormData,
) {
  const reason = readReason(formData);

  if (!reason) {
    redirect('/admin/classificados?erro=motivo');
  }

  const supabase = await requireClassifiedAdmin();

  const { data, error } = await supabase
    .from('classifieds')
    .update({
      status: 'rejected',
      rejection_reason: reason,
    })
    .eq('id', classifiedId)
    .eq('status', 'pending_review')
    .select('id')
    .maybeSingle();

  if (error || !data) {
    redirect('/admin/classificados?erro=rejeitar');
  }

  revalidatePath('/admin/classificados');
  revalidatePath('/classificados/meus');
  redirect('/admin/classificados?ok=rejeitado');
}

export async function pausePublishedClassifiedAction(
  classifiedId: string,
  formData: FormData,
) {
  const reason = readReason(formData);

  if (!reason) {
    redirect('/admin/classificados?erro=motivo');
  }

  const supabase = await requireClassifiedAdmin();

  const { data, error } = await supabase
    .from('classifieds')
    .update({
      status: 'paused',
      rejection_reason: reason,
    })
    .eq('id', classifiedId)
    .eq('status', 'published')
    .select('id')
    .maybeSingle();

  if (error || !data) {
    redirect('/admin/classificados?erro=pausar');
  }

  revalidatePath('/admin/classificados');
  revalidatePath('/classificados');
  revalidatePath('/classificados/meus');
  redirect('/admin/classificados?ok=pausado');
}
