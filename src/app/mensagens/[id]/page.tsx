import type { Metadata } from 'next';
import { territoryReleaseScope } from '@/config/territory-release-scope';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { sendConversationMessageAction } from '@/app/mensagens/actions';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';
import { AccountContextRail } from '@/shared/layout/account-context-rail';

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
  const isPublished = conversation.classifieds?.status === 'published';
  const messageCount = messagesResult.data?.length ?? 0;
  const sendAction = sendConversationMessageAction.bind(null, conversation.id);

  return (
    <TerritoryAppShell
      activeId="classifieds"
      territoryName={territoryReleaseScope.city.name}
      contextRail={<AccountContextRail active="messages" />}
    >
      <main>

      <section className="threadShell">
        <div className="container threadContainer">
          <header className="threadHeader">
            <div>
              <Link className="textLink" href="/mensagens">
                ← Mensagens
              </Link>
              <p className="eyebrow">Conversa de Classificados</p>
              <h1>{conversation.classifieds?.title ?? 'Classificado'}</h1>
              <p>
                {isSeller
                  ? 'Você é o anunciante nesta conversa.'
                  : 'Você iniciou esta conversa como interessado.'}
              </p>

              <div className="threadContextBar" aria-label="Contexto da conversa">
                <span>
                  <strong>{isSeller ? 'Anunciante' : 'Interessado'}</strong>
                  <small>Seu papel</small>
                </span>
                <span>
                  <strong>{isPublished ? 'Publicado' : 'Fora da área pública'}</strong>
                  <small>Status do anúncio</small>
                </span>
                <span>
                  <strong>{messageCount}</strong>
                  <small>{messageCount === 1 ? 'mensagem' : 'mensagens'}</small>
                </span>
              </div>
            </div>

            {isPublished && (
              <Link
                className="ghostButton linkButton"
                href={`/classificados/anuncio/${conversation.classifieds?.slug}`}
              >
                Ver anúncio
              </Link>
            )}
          </header>

          <div className="messageList" aria-live="polite">
            {messageCount === 0 && (
              <div className="messageThreadEmpty">
                <strong>A conversa está pronta.</strong>
                <p>Envie a primeira mensagem para continuar por aqui.</p>
              </div>
            )}

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
              <small className="messageComposerHint">
                Até 1.500 caracteres · evite compartilhar dados sensíveis.
              </small>
            </label>
            <button className="primaryButton" type="submit">
              Enviar mensagem
            </button>
          </form>
        </div>
      </section>

      </main>
    </TerritoryAppShell>
  );
}
