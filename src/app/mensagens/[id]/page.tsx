import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { sendConversationMessageAction } from '@/app/mensagens/actions';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Conversa',
  robots: {
    index: false,
    follow: false,
  },
};

type ThreadPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
};

type ConversationRow = {
  id: string;
  buyer_id: string;
  seller_id: string;
  classifieds: {
    title: string;
    slug: string;
    status: string;
  } | null;
};

export default async function ConversationPage({
  params,
  searchParams,
}: ThreadPageProps) {
  if (!getSupabasePublicConfig()) {
    redirect('/entrar?erro=indisponivel&next=/mensagens');
  }

  const [{ id }, query] = await Promise.all([params, searchParams]);
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (typeof userId !== 'string') {
    redirect(`/entrar?next=/mensagens/${id}`);
  }

  const [{ data: rawConversation, error: conversationError }, messagesResult] =
    await Promise.all([
      supabase
        .from('classified_conversations')
        .select('id, buyer_id, seller_id, classifieds(title, slug, status)')
        .eq('id', id)
        .maybeSingle(),
      supabase
        .from('classified_messages')
        .select('id, sender_id, body, created_at')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true })
        .limit(200),
    ]);

  if (conversationError) throw conversationError;
  if (messagesResult.error) throw messagesResult.error;
  if (!rawConversation) notFound();

  const conversation = rawConversation as unknown as ConversationRow;
  const isSeller = conversation.seller_id === userId;
  const sendAction = sendConversationMessageAction.bind(null, conversation.id);

  return (
    <main>
      <SiteHeader />

      <section className="threadShell">
        <div className="container threadContainer">
          <header className="threadHeader">
            <div>
              <Link className="textLink" href="/mensagens">
                ← Mensagens
              </Link>
              <h1>{conversation.classifieds?.title ?? 'Classificado'}</h1>
              <p>
                {isSeller
                  ? 'Você é o anunciante nesta conversa.'
                  : 'Você iniciou esta conversa como interessado.'}
              </p>
            </div>

            {conversation.classifieds?.status === 'published' && (
              <Link
                className="ghostButton linkButton"
                href={`/classificados/anuncio/${conversation.classifieds.slug}`}
              >
                Ver anúncio
              </Link>
            )}
          </header>

          <div className="messageList" aria-live="polite">
            {messagesResult.data?.map((message) => {
              const mine = message.sender_id === userId;

              return (
                <article
                  className={mine ? 'messageBubble messageMine' : 'messageBubble'}
                  key={message.id}
                >
                  <small>{mine ? 'Você' : isSeller ? 'Interessado' : 'Anunciante'}</small>
                  <p>{message.body}</p>
                  <time dateTime={message.created_at}>
                    {new Date(message.created_at).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </time>
                </article>
              );
            })}
          </div>

          <form className="messageComposer" action={sendAction}>
            {query.erro === 'mensagem_invalida' && (
              <div className="authFeedback authError">
                Escreva uma mensagem de até 1.500 caracteres.
              </div>
            )}
            <label>
              <span className="srOnly">Mensagem</span>
              <textarea
                name="message"
                rows={3}
                minLength={1}
                maxLength={1500}
                required
                placeholder="Escreva uma mensagem..."
              />
            </label>
            <button className="primaryButton" type="submit">
              Enviar
            </button>
          </form>
        </div>
      </section>

      <MobileTabbar />
    </main>
  );
}
