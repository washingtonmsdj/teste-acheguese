import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  approveClassifiedAction,
  pausePublishedClassifiedAction,
  rejectClassifiedAction,
} from '@/app/admin/classificados/actions';
import { hasClassifiedAdminRole } from '@/lib/auth/roles';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/shared/layout/site-header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Moderação de Classificados',
  robots: {
    index: false,
    follow: false,
  },
};

type AdminPageProps = {
  searchParams: Promise<{
    erro?: string;
    ok?: string;
  }>;
};

type ReportRow = {
  id: string;
  reason: string;
  details: string | null;
  created_at: string;
  classified_id: string;
  classifieds: {
    id: string;
    title: string;
    slug: string;
    status: string;
  } | null;
};

const reportLabels: Record<string, string> = {
  fraud: 'Possível fraude',
  prohibited: 'Item proibido',
  duplicate: 'Anúncio duplicado',
  wrong_category: 'Categoria incorreta',
  harassment: 'Assédio/conteúdo ofensivo',
  other: 'Outro motivo',
};

export default async function ClassifiedAdminPage({
  searchParams,
}: AdminPageProps) {
  if (!getSupabasePublicConfig()) {
    redirect('/');
  }

  const query = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!hasClassifiedAdminRole(claimsData?.claims)) {
    notFound();
  }

  const [pendingResult, reportsResult] = await Promise.all([
    supabase
      .from('classifieds')
      .select(
        'id, title, description, category_id, neighborhood, price_cents, updated_at, owner_id',
      )
      .eq('status', 'pending_review')
      .order('updated_at', { ascending: true })
      .limit(100),
    supabase
      .from('classified_reports')
      .select(
        'id, reason, details, created_at, classified_id, classifieds(id, title, slug, status)',
      )
      .order('created_at', { ascending: false })
      .limit(100),
  ]);

  if (pendingResult.error) throw pendingResult.error;
  if (reportsResult.error) throw reportsResult.error;

  const reports = (reportsResult.data ?? []) as unknown as ReportRow[];

  return (
    <main>
      <SiteHeader />

      <section className="adminHero">
        <div className="container">
          <p className="eyebrow">Área restrita</p>
          <h1>Moderação de Classificados</h1>
          <p>
            Aprove, devolva para ajustes e analise denúncias sem alterar o conteúdo
            original do anúncio.
          </p>
        </div>
      </section>

      <section className="section container">
        {query.ok && (
          <div className="successNotice">
            Ação de moderação concluída.
          </div>
        )}
        {query.erro && (
          <div className="authFeedback authError" role="alert">
            {query.erro === 'motivo'
              ? 'Informe um motivo com pelo menos 10 caracteres.'
              : 'Não foi possível concluir a ação de moderação.'}
          </div>
        )}

        <div className="adminSectionHeading">
          <div>
            <p className="eyebrow">Fila de revisão</p>
            <h2>Pendentes</h2>
          </div>
          <span>{pendingResult.data?.length ?? 0}</span>
        </div>

        {pendingResult.data?.length ? (
          <div className="moderationGrid">
            {pendingResult.data.map((item) => {
              const approveAction = approveClassifiedAction.bind(null, item.id);
              const rejectAction = rejectClassifiedAction.bind(null, item.id);

              return (
                <article className="moderationCard" key={item.id}>
                  <div>
                    <span className="statusPill">Em revisão</span>
                    <h3>{item.title}</h3>
                    <p className="moderationDescription">{item.description}</p>
                    <div className="moderationMeta">
                      <span>{item.category_id}</span>
                      <span>{item.neighborhood || 'Bairro não informado'}</span>
                      <span>
                        {item.price_cents === null
                          ? 'Preço a combinar'
                          : new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(item.price_cents / 100)}
                      </span>
                    </div>
                  </div>

                  <div className="moderationActions">
                    <form action={approveAction}>
                      <button className="primaryButton" type="submit">
                        Aprovar e publicar
                      </button>
                    </form>

                    <form className="moderationReasonForm" action={rejectAction}>
                      <label>
                        Motivo para ajustes
                        <textarea
                          name="reason"
                          rows={3}
                          minLength={10}
                          maxLength={1000}
                          required
                          placeholder="Explique objetivamente o que precisa ser corrigido."
                        />
                      </label>
                      <button className="ghostButton" type="submit">
                        Rejeitar para ajustes
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="adminEmptyState">
            Nenhum anúncio aguardando revisão.
          </div>
        )}
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="adminSectionHeading">
            <div>
              <p className="eyebrow">Segurança</p>
              <h2>Denúncias recentes</h2>
            </div>
            <span>{reports.length}</span>
          </div>

          {reports.length ? (
            <div className="reportList">
              {reports.map((report) => {
                const pauseAction = pausePublishedClassifiedAction.bind(
                  null,
                  report.classified_id,
                );

                return (
                  <article className="reportCard" key={report.id}>
                    <div>
                      <strong>{reportLabels[report.reason] ?? report.reason}</strong>
                      <h3>{report.classifieds?.title ?? 'Anúncio indisponível'}</h3>
                      {report.details && <p>{report.details}</p>}
                      <small>
                        Recebida em{' '}
                        {new Date(report.created_at).toLocaleString('pt-BR')}
                      </small>
                    </div>

                    <div className="reportActions">
                      {report.classifieds?.status === 'published' && (
                        <>
                          <Link
                            className="ghostButton linkButton"
                            href={`/classificados/anuncio/${report.classifieds.slug}`}
                          >
                            Abrir anúncio
                          </Link>
                          <form className="moderationReasonForm" action={pauseAction}>
                            <label>
                              Motivo para retirar do ar
                              <textarea
                                name="reason"
                                rows={2}
                                minLength={10}
                                maxLength={1000}
                                required
                              />
                            </label>
                            <button className="ghostButton" type="submit">
                              Retirar para ajustes
                            </button>
                          </form>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="adminEmptyState">
              Nenhuma denúncia registrada.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
