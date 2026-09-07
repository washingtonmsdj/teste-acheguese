import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  submitForReviewAction,
  updateClassifiedAction,
  withdrawFromReviewAction,
} from '@/app/classificados/[id]/editar/actions';
import {
  archiveClassifiedAction,
  deleteArchivedClassifiedAction,
  markClassifiedSoldAction,
  pauseClassifiedAction,
} from '@/app/classificados/[id]/lifecycle-actions';
import { ClassifiedMediaUploader } from '@/modules/classifieds/components/media-uploader';
import { classifiedCategories } from '@/modules/classifieds/domain/categories';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Editar anúncio',
  robots: {
    index: false,
    follow: false,
  },
};

type EditPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    erro?: string;
    salvo?: string;
    retirado?: string;
    estado?: string;
  }>;
};

const mutableStatuses = new Set(['draft', 'paused', 'rejected']);

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  pending_review: 'Em revisão',
  published: 'Publicado',
  paused: 'Pausado',
  sold: 'Vendido',
  rejected: 'Precisa de ajustes',
  archived: 'Arquivado',
};

function priceInput(value: number | null) {
  if (value === null) return '';
  return (value / 100).toFixed(2).replace('.', ',');
}

export default async function EditClassifiedPage({
  params,
  searchParams,
}: EditPageProps) {
  if (!getSupabasePublicConfig()) {
    redirect('/entrar?erro=indisponivel&next=/classificados/meus');
  }

  const [{ id }, query] = await Promise.all([params, searchParams]);
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const ownerId = claimsData?.claims?.sub;

  if (typeof ownerId !== 'string') {
    redirect(`/entrar?next=/classificados/${id}/editar`);
  }

  const [{ data: item, error }, { data: cities, error: cityError }] =
    await Promise.all([
      supabase
        .from('classifieds')
        .select(
          'id, title, description, category_id, city_id, condition, price_cents, neighborhood, status, rejection_reason, classified_media(id, storage_key, position)',
        )
        .eq('id', id)
        .eq('owner_id', ownerId)
        .maybeSingle(),
      supabase
        .from('cities')
        .select('id, name, state_code')
        .eq('is_active', true)
        .order('name'),
    ]);

  if (error) throw error;
  if (cityError) throw cityError;
  if (!item) notFound();

  const signedMedia = await Promise.all(
    item.classified_media
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(async (media) => {
        const { data } = await supabase.storage
          .from('classified-media')
          .createSignedUrl(media.storage_key, 3600);

        return {
          id: media.id,
          storageKey: media.storage_key,
          position: media.position,
          signedUrl: data?.signedUrl ?? null,
        };
      }),
  );

  const editable = mutableStatuses.has(item.status);
  const updateAction = updateClassifiedAction.bind(null, item.id);
  const submitAction = submitForReviewAction.bind(null, item.id);
  const withdrawAction = withdrawFromReviewAction.bind(null, item.id);
  const pauseAction = pauseClassifiedAction.bind(null, item.id);
  const soldAction = markClassifiedSoldAction.bind(null, item.id);
  const archiveAction = archiveClassifiedAction.bind(null, item.id);
  const deleteAction = deleteArchivedClassifiedAction.bind(null, item.id);

  return (
    <main>
      <SiteHeader />

      <section className="internalHero compactInternalHero">
        <div className="container narrow">
          <p className="eyebrow">Classificados</p>
          <span className="statusPill">{statusLabels[item.status] ?? item.status}</span>
          <h1>{editable ? 'Revise seu anúncio.' : 'Acompanhe seu anúncio.'}</h1>
          <p>
            {editable
              ? 'Atualize os dados e as fotos antes de enviar para revisão.'
              : item.status === 'pending_review'
                ? 'Enquanto estiver em revisão, os dados e as fotos ficam bloqueados.'
                : 'Este anúncio não está em um estado editável.'}
          </p>
        </div>
      </section>

      <section className="section container editClassifiedLayout">
        <div>
          {query.salvo === '1' && (
            <div className="successNotice">Alterações salvas.</div>
          )}
          {query.retirado === '1' && (
            <div className="successNotice">
              O anúncio voltou para rascunho e pode ser editado.
            </div>
          )}
          {query.estado === 'atualizado' && (
            <div className="successNotice">
              Estado do anúncio atualizado.
            </div>
          )}

          {item.rejection_reason && ['rejected', 'paused'].includes(item.status) && (
            <div className="moderationOwnerNotice">
              <strong>O anúncio precisa de ajustes</strong>
              <p>{item.rejection_reason}</p>
            </div>
          )}

          {query.erro && (
            <div className="authFeedback authError" role="alert">
              {query.erro === 'foto_obrigatoria'
                ? 'Adicione pelo menos uma foto antes de enviar para revisão.'
                : query.erro === 'dados_invalidos'
                  ? 'Revise os campos obrigatórios.'
                  : query.erro === 'historico'
                    ? 'Este anúncio possui conversas, denúncias ou histórico de moderação e deve permanecer arquivado.'
                    : query.erro === 'estado'
                      ? 'Não foi possível alterar o estado do anúncio.'
                      : query.erro === 'excluir'
                        ? 'Não foi possível excluir o anúncio.'
                        : 'Não foi possível concluir a ação. Tente novamente.'}
            </div>
          )}

          <form className="classifiedForm" action={updateAction}>
            <fieldset disabled={!editable}>
              <label>
                Título
                <input
                  name="title"
                  defaultValue={item.title}
                  minLength={5}
                  maxLength={120}
                  required
                />
              </label>

              <label>
                Categoria
                <select name="categoryId" defaultValue={item.category_id} required>
                  {classifiedCategories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="formColumns">
                <label>
                  Preço
                  <input
                    name="price"
                    inputMode="decimal"
                    defaultValue={priceInput(item.price_cents)}
                    placeholder="R$ 0,00"
                  />
                </label>

                <label>
                  Condição
                  <select name="condition" defaultValue={item.condition} required>
                    <option value="new">Novo</option>
                    <option value="like_new">Seminovo</option>
                    <option value="used">Usado</option>
                    <option value="for_parts">Para peças</option>
                  </select>
                </label>
              </div>

              <label>
                Descrição
                <textarea
                  name="description"
                  defaultValue={item.description}
                  rows={7}
                  minLength={20}
                  maxLength={5000}
                  required
                />
              </label>

              <div className="formColumns">
                <label>
                  Cidade
                  <select name="cityId" defaultValue={String(item.city_id)} required>
                    {cities?.map((city) => (
                      <option value={city.id} key={city.id}>
                        {city.name} - {city.state_code}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Bairro
                  <input
                    name="neighborhood"
                    defaultValue={item.neighborhood ?? ''}
                    maxLength={120}
                  />
                </label>
              </div>
            </fieldset>

            {editable && (
              <button className="primaryButton" type="submit">
                Salvar alterações
              </button>
            )}
          </form>
        </div>

        <aside className="editSidebar">
          {editable && (
            <ClassifiedMediaUploader
              classifiedId={item.id}
              ownerId={ownerId}
              title={item.title}
              initialMedia={signedMedia}
            />
          )}

          {!editable && signedMedia.length > 0 && (
            <div className="mediaReadOnly">
              <h2>Fotos</h2>
              <div className="mediaGrid">
                {signedMedia.map((media) => (
                  <article className="mediaCard" key={media.id}>
                    {media.signedUrl ? (
                      <Image
                        src={media.signedUrl}
                        alt={item.title}
                        fill
                        sizes="(min-width: 980px) 240px, 45vw"
                      />
                    ) : (
                      <div className="mediaPlaceholder">Imagem</div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

          {editable && (
            <form className="reviewActionCard" action={submitAction}>
              <strong>Pronto para revisão?</strong>
              <p>
                É necessário ter pelo menos uma foto. Depois do envio, o conteúdo fica
                bloqueado até a revisão terminar ou você retirar o pedido.
              </p>
              <button className="primaryButton" type="submit">
                Enviar para revisão
              </button>
            </form>
          )}

          {item.status === 'pending_review' && (
            <form className="reviewActionCard" action={withdrawAction}>
              <strong>Quer alterar alguma coisa?</strong>
              <p>Retire da revisão para voltar o anúncio ao estado de rascunho.</p>
              <button className="ghostButton" type="submit">
                Retirar da revisão
              </button>
            </form>
          )}

          {item.status === 'published' && (
            <div className="reviewActionCard">
              <strong>Gerenciar publicação</strong>
              <p>
                Pausar ou marcar como vendido remove o anúncio da área pública.
                Um anúncio pausado precisa passar por nova revisão para voltar ao ar.
              </p>
              <form action={pauseAction}>
                <button className="ghostButton" type="submit">
                  Pausar anúncio
                </button>
              </form>
              <form action={soldAction}>
                <button className="ghostButton" type="submit">
                  Marcar como vendido
                </button>
              </form>
              <form action={archiveAction}>
                <button className="ghostButton" type="submit">
                  Arquivar anúncio
                </button>
              </form>
            </div>
          )}

          {['draft', 'paused', 'rejected', 'sold'].includes(item.status) && (
            <form className="reviewActionCard" action={archiveAction}>
              <strong>Arquivar anúncio</strong>
              <p>
                O anúncio sai do fluxo ativo e pode ser mantido apenas como histórico.
              </p>
              <button className="ghostButton" type="submit">
                Arquivar
              </button>
            </form>
          )}

          {item.status === 'archived' && (
            <form className="reviewActionCard dangerActionCard" action={deleteAction}>
              <strong>Excluir definitivamente</strong>
              <p>
                Só é possível excluir anúncios sem conversas, denúncias ou histórico de moderação.
                Esta ação não pode ser desfeita.
              </p>
              <button className="dangerButton" type="submit">
                Excluir anúncio
              </button>
            </form>
          )}

          <Link className="textLink" href="/classificados/meus">
            ← Voltar para Meus anúncios
          </Link>
        </aside>
      </section>

      <MobileTabbar />
    </main>
  );
}
