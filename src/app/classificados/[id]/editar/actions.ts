'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { validateClassifiedFormData } from '@/modules/classifieds/domain/classified-form';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function authenticatedOwner() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const ownerId = data?.claims?.sub;

  if (error || typeof ownerId !== 'string') {
    redirect('/entrar?next=/classificados/meus');
  }

  return { supabase, ownerId };
}

export async function updateClassifiedAction(
  classifiedId: string,
  formData: FormData,
) {
  const validation = validateClassifiedFormData(formData);

  if (!validation.ok) {
    redirect(`/classificados/${classifiedId}/editar?erro=dados_invalidos`);
  }

  const { supabase, ownerId } = await authenticatedOwner();

  const { error } = await supabase
    .from('classifieds')
    .update({
      category_id: validation.value.categoryId,
      city_id: Number(validation.value.cityId),
      title: validation.value.title,
      description: validation.value.description,
      condition: validation.value.condition,
      price_cents: validation.value.priceInCents,
      neighborhood: validation.value.neighborhood,
    })
    .eq('id', classifiedId)
    .eq('owner_id', ownerId);

  if (error) {
    redirect(`/classificados/${classifiedId}/editar?erro=salvar_falhou`);
  }

  revalidatePath('/classificados/meus');
  revalidatePath(`/classificados/${classifiedId}/editar`);
  redirect(`/classificados/${classifiedId}/editar?salvo=1`);
}

export async function submitForReviewAction(classifiedId: string) {
  const { supabase } = await authenticatedOwner();
  const { error } = await supabase.rpc('submit_classified_for_review', {
    p_classified_id: classifiedId,
  });

  if (error) {
    const code = error.message.includes('classified_media_required')
      ? 'foto_obrigatoria'
      : 'envio_falhou';

    redirect(`/classificados/${classifiedId}/editar?erro=${code}`);
  }

  revalidatePath('/classificados/meus');
  revalidatePath(`/classificados/${classifiedId}/editar`);
  redirect('/classificados/meus?enviado=1');
}

export async function withdrawFromReviewAction(classifiedId: string) {
  const { supabase } = await authenticatedOwner();
  const { error } = await supabase.rpc('withdraw_classified_from_review', {
    p_classified_id: classifiedId,
  });

  if (error) {
    redirect(`/classificados/${classifiedId}/editar?erro=retirada_falhou`);
  }

  revalidatePath('/classificados/meus');
  revalidatePath(`/classificados/${classifiedId}/editar`);
  redirect(`/classificados/${classifiedId}/editar?retirado=1`);
}
