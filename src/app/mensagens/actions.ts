'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function cleanMessage(formData: FormData) {
  const value = formData.get('message');
  return typeof value === 'string' ? value.trim() : '';
}

async function authenticatedMessagingClient(next: string) {
  if (!getSupabasePublicConfig()) {
    redirect(`/entrar?erro=indisponivel&next=${encodeURIComponent(next)}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (typeof userId !== 'string') {
    redirect(`/entrar?next=${encodeURIComponent(next)}`);
  }

  return { supabase, userId };
}

export async function startConversationAction(
  classifiedId: string,
  slug: string,
  formData: FormData,
) {
  const returnPath = `/classificados/anuncio/${slug}`;
  const message = cleanMessage(formData);

  if (!message || message.length > 1500) {
    redirect(`${returnPath}?erro=mensagem_invalida`);
  }

  const { supabase, userId } = await authenticatedMessagingClient(returnPath);

  const { data: classified, error: classifiedError } = await supabase
    .from('classifieds')
    .select('id, owner_id')
    .eq('id', classifiedId)
    .eq('status', 'published')
    .maybeSingle();

  if (classifiedError) throw classifiedError;
  if (!classified) redirect('/classificados');

  if (classified.owner_id === userId) {
    redirect(`${returnPath}?erro=anuncio_proprio`);
  }

  let { data: conversation, error: conversationError } = await supabase
    .from('classified_conversations')
    .select('id')
    .eq('classified_id', classifiedId)
    .eq('buyer_id', userId)
    .maybeSingle();

  if (conversationError) throw conversationError;

  if (!conversation) {
    const created = await supabase
      .from('classified_conversations')
      .insert({
        classified_id: classifiedId,
        buyer_id: userId,
        seller_id: classified.owner_id,
      })
      .select('id')
      .single();

    if (created.error) {
      if (created.error.code !== '23505') {
        throw created.error;
      }

      const existing = await supabase
        .from('classified_conversations')
        .select('id')
        .eq('classified_id', classifiedId)
        .eq('buyer_id', userId)
        .single();

      if (existing.error) throw existing.error;
      conversation = existing.data;
    } else {
      conversation = created.data;
    }
  }

  const { error: messageError } = await supabase
    .from('classified_messages')
    .insert({
      conversation_id: conversation.id,
      sender_id: userId,
      body: message,
    });

  if (messageError) throw messageError;

  revalidatePath('/mensagens');
  redirect(`/mensagens/${conversation.id}`);
}

export async function sendConversationMessageAction(
  conversationId: string,
  formData: FormData,
) {
  const next = `/mensagens/${conversationId}`;
  const message = cleanMessage(formData);

  if (!message || message.length > 1500) {
    redirect(`${next}?erro=mensagem_invalida`);
  }

  const { supabase, userId } = await authenticatedMessagingClient(next);

  const { error } = await supabase
    .from('classified_messages')
    .insert({
      conversation_id: conversationId,
      sender_id: userId,
      body: message,
    });

  if (error) throw error;

  revalidatePath('/mensagens');
  revalidatePath(next);
  redirect(next);
}
