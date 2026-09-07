'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SupabaseClassifiedsRepository } from '@/modules/classifieds/data/supabase-classifieds-repository';
import { validateClassifiedFormData } from '@/modules/classifieds/domain/classified-form';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function createClassifiedDraftAction(formData: FormData) {
  const result = validateClassifiedFormData(formData);

  if (!result.ok) {
    const params = new URLSearchParams({
      erro: 'dados_invalidos',
    });
    redirect(`/classificados/novo?${params.toString()}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const ownerId = data?.claims?.sub;

  if (error || typeof ownerId !== 'string') {
    redirect('/entrar?next=/classificados/novo');
  }

  const repository = new SupabaseClassifiedsRepository(supabase);
  await repository.createDraft(ownerId, result.value);

  revalidatePath('/classificados/meus');
  redirect('/classificados/meus?criado=1');
}
