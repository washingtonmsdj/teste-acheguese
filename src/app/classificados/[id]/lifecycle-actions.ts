'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function authenticatedOwner(next: string) {
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const ownerId = claimsData?.claims?.sub;

  if (typeof ownerId !== 'string') {
    redirect(`/entrar?next=${encodeURIComponent(next)}`);
  }

  return { supabase, ownerId };
}

async function transitionOwnedClassified(
  classifiedId: string,
  expectedStatuses: string[],
  nextStatus: string,
) {
  const next = `/classificados/${classifiedId}/editar`;
  const { supabase, ownerId } = await authenticatedOwner(next);

  const { data, error } = await supabase
    .from('classifieds')
    .update({ status: nextStatus })
    .eq('id', classifiedId)
    .eq('owner_id', ownerId)
    .in('status', expectedStatuses)
    .select('id')
    .maybeSingle();

  if (error || !data) {
    redirect(`${next}?erro=estado`);
  }

  revalidatePath('/classificados');
  revalidatePath('/classificados/meus');
  revalidatePath(next);
  redirect(`${next}?estado=atualizado`);
}

export async function pauseClassifiedAction(classifiedId: string) {
  return transitionOwnedClassified(
    classifiedId,
    ['published'],
    'paused',
  );
}

export async function markClassifiedSoldAction(classifiedId: string) {
  return transitionOwnedClassified(
    classifiedId,
    ['published'],
    'sold',
  );
}

export async function archiveClassifiedAction(classifiedId: string) {
  return transitionOwnedClassified(
    classifiedId,
    ['draft', 'paused', 'rejected', 'published', 'sold'],
    'archived',
  );
}

export async function deleteArchivedClassifiedAction(classifiedId: string) {
  const next = `/classificados/${classifiedId}/editar`;
  const { supabase, ownerId } = await authenticatedOwner(next);

  const { data: item, error: itemError } = await supabase
    .from('classifieds')
    .select('id, status, classified_media(storage_key)')
    .eq('id', classifiedId)
    .eq('owner_id', ownerId)
    .maybeSingle();

  if (itemError || !item || item.status !== 'archived') {
    redirect(`${next}?erro=excluir`);
  }

  const storageKeys = item.classified_media.map((media) => media.storage_key);

  const { data: deleted, error: deleteError } = await supabase
    .from('classifieds')
    .delete()
    .eq('id', classifiedId)
    .eq('owner_id', ownerId)
    .eq('status', 'archived')
    .select('id')
    .maybeSingle();

  if (deleteError || !deleted) {
    const hasHistory =
      deleteError?.message.includes('classified_has_conversations') ||
      deleteError?.message.includes('classified_has_reports') ||
      deleteError?.message.includes('classified_has_moderation_history');

    redirect(
      `${next}?erro=${hasHistory ? 'historico' : 'excluir'}`,
    );
  }

  let storageCleanupFailed = false;

  if (storageKeys.length) {
    const { error: storageError } = await supabase.storage
      .from('classified-media')
      .remove(storageKeys);

    storageCleanupFailed = Boolean(storageError);
  }

  revalidatePath('/classificados');
  revalidatePath('/classificados/meus');
  revalidatePath('/favoritos');

  redirect(
    storageCleanupFailed
      ? '/classificados/meus?excluido=1&midia=pendente'
      : '/classificados/meus?excluido=1',
  );
}
