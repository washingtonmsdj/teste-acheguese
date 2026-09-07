import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

export const metadata: Metadata = {
  title: 'Meus anúncios',
  robots: {
    index: false,
    follow: false,
  },
};

type MyClassifiedsPageProps = {
  searchParams: Promise<{
    criado?: string;
    enviado?: string;
  }>;
};

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  pending_review: 'Em revisão',
  published: 'Publicado',
  paused: 'Pausado',
  sold: 'Vendido',
  rejected: 'Precisa de ajustes',
  archived: 'Arquivado',
};

function money(value: number | null) {
  if (value === null) return 'Preço a combinar';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100);
}

export default async function MyClassifiedsPage({
  searchParams,
}: MyClassifiedsPageProps) {
  if (!getSupabasePublicConfig()) {
    redirect('/entrar?erro=indisponivel&next=/classificados/meus');
  }

  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const ownerId = claimsData?.claims?.sub;

  if (typeof ownerId !== 'string') {
    redirect('/entrar?next=/classificados/meus');
  }

  const { data: items, error } = await supabase
    .from('classifieds')
    .select('id, title, price_cents, status, updated_at')
    .eq('owner_id', ownerId)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return (
    <main>
      <SiteHeader />

      <section className="internalHero compactInternalHero">
        <div className="container narrow">
          <p className="eyebrow">Sua conta</p>
          <h1>Meus anúncios</h1>
          <p>Gerencie rascunhos e acompanhe o estado dos seus Classificados.</p>
          <Link className="primaryButton linkButton" href="/classificados/novo">
            Criar novo anúncio
          </Link>
        </div>
      </section>

      <section className="section container">
        {params.criado === '1' && (
          <div className="successNotice">
            Rascunho criado. Agora adicione fotos e revise antes de enviar.
          </div>
        )}

        {params.enviado === '1' && (
          <div className="successNotice">
            Anúncio enviado para revisão. Você pode acompanhar o estado por aqui.
          </div>
        )}

        {items?.length ? (
          <div className="ownerClassifiedList">
            {items.map((item) => (
              <article key={item.id}>
                <div>
                  <span className="statusPill">
                    {statusLabels[item.status] ?? item.status}
                  </span>
                  <h2>{item.title}</h2>
                  <p>{money(item.price_cents)}</p>
                </div>

                <div className="ownerClassifiedActions">
                  <span className="mutedMeta">
                    Atualizado em {new Date(item.updated_at).toLocaleDateString('pt-BR')}
                  </span>
                  <Link
                    className="ghostButton linkButton"
                    href={`/classificados/${item.id}/editar`}
                  >
                    Abrir
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="classifiedEmptyState">
            <span className="emptyIcon" aria-hidden="true">＋</span>
            <div>
              <h3>Você ainda não criou nenhum anúncio.</h3>
              <p>Comece com um rascunho e revise tudo antes de enviar para publicação.</p>
            </div>
            <Link className="primaryButton linkButton" href="/classificados/novo">
              Criar primeiro anúncio
            </Link>
          </div>
        )}
      </section>

      <MobileTabbar />
    </main>
  );
}
