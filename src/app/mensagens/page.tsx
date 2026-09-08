import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mensagens',
  robots: {
    index: false,
    follow: false,
  },
};

type ConversationRow = {
  id: string;
  buyer_id: string;
  seller_id: string;
  updated_at: string;
  classifieds: {
    title: string;
    slug: string;
    status: string;
  } | null;
};

export default async function MessagesPage() {
  if (!getSupabasePublicConfig()) {
    redirect('/entrar?erro=indisponivel&next=/mensagens');
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (typeof userId !== 'string') {
    redirect('/entrar?next=/mensagens');
  }

  const { data, error } = await supabase
    .from('classified_conversations')
    .select('id, buyer_id, seller_id, updated_at, classifieds(title, slug, status)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  const conversations = (data ?? []) as unknown as ConversationRow[];

  return (
    <TerritoryAppShell
      activeId="classifieds"
      territoryName="Salvador"
    >
      <main>

      <section className="internalHero compactInternalHero">
        <div className="container narrow">
          <p className="eyebrow">Contato seguro</p>
          <h1>Mensagens</h1>
          <p>
            Converse dentro do Achegue-se sem publicar telefone ou e-mail no anúncio.
          </p>
        </div>
      </section>

      <section className="section container">
        {conversations.length ? (
          <div className="conversationList">
            {conversations.map((conversation) => {
              const isSeller = conversation.seller_id === userId;

              return (
                <Link
                  className="conversationCard"
                  href={`/mensagens/${conversation.id}`}
                  key={conversation.id}
                >
                  <div>
                    <span className="statusPill">
                      {isSeller ? 'Seu anúncio' : 'Seu interesse'}
                    </span>
                    <h2>{conversation.classifieds?.title ?? 'Classificado'}</h2>
                    <p>
                      {conversation.classifieds?.status === 'published'
                        ? 'Anúncio publicado'
                        : 'Anúncio não está mais público'}
                    </p>
                  </div>
                  <div className="conversationCardMeta">
                    <span>
                      {new Date(conversation.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                    <strong>Ver conversa →</strong>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="classifiedEmptyState">
            <span className="emptyIcon" aria-hidden="true">✉</span>
            <div>
              <h3>Nenhuma conversa ainda.</h3>
              <p>
                Abra um anúncio publicado e envie uma mensagem ao anunciante.
              </p>
            </div>
            <Link className="primaryButton linkButton" href="/classificados">
              Explorar Classificados
            </Link>
          </div>
        )}
      </section>

      </main>
    </TerritoryAppShell>
  );
}
