import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toggleFavoriteAction } from '@/app/classificados/favorite-actions';
import { startConversationAction } from '@/app/mensagens/actions';
import { SupabaseClassifiedsRepository } from '@/features/classifieds/data/supabase-classifieds-repository';
import {
  classifiedConditionLabels,
  formatClassifiedLocation,
  formatClassifiedPrice,
} from '@/features/classifieds/presentation';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

type DetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ erro?: string }>;
};

async function loadPublishedClassified(slug: string) {
  if (!getSupabasePublicConfig()) return null;

  const supabase = await createSupabaseServerClient();
  const repository = new SupabaseClassifiedsRepository(supabase);
  const item = await repository.findPublishedBySlug(slug);

  if (!item) return null;

  const images = await Promise.all(
    item.media
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(async (media) => {
        const { data } = await supabase.storage
          .from('classified-media')
          .createSignedUrl(media.storageKey, 3600);

        return {
          ...media,
          signedUrl: data?.signedUrl ?? null,
        };
      }),
  );

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  let isFavorite = false;

  if (typeof userId === 'string') {
    const { data, error } = await supabase
      .from('classified_favorites')
      .select('classified_id')
      .eq('user_id', userId)
      .eq('classified_id', item.id)
      .maybeSingle();

    if (error) throw error;
    isFavorite = Boolean(data);
  }

  return {
    item,
    images,
    isFavorite,
    userId: typeof userId === 'string' ? userId : null,
  };
}

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await loadPublishedClassified(slug);

  if (!loaded) {
    return {
      title: 'Anúncio não encontrado',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: loaded.item.title,
    description: loaded.item.description.slice(0, 155),
  };
}

export default async function ClassifiedDetailPage({
  params,
  searchParams,
}: DetailPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const loaded = await loadPublishedClassified(slug);

  if (!loaded) notFound();

  const { item, images, isFavorite, userId } = loaded;
  const isOwner = userId === item.ownerId;
  const returnPath = `/classificados/anuncio/${item.slug}`;
  const favoriteAction = toggleFavoriteAction.bind(
    null,
    item.id,
    returnPath,
  );
  const conversationAction = startConversationAction.bind(
    null,
    item.id,
    item.slug,
  );

  return (
    <main>
      <SiteHeader />

      <section className="section container publicDetailLayout">
        <div className="publicDetailMain">
          <Link className="textLink" href="/classificados">
            ← Voltar aos Classificados
          </Link>

          <div className="publicDetailGallery">
            {images.map((image, index) => (
              <article
                className={index === 0 ? 'detailImage detailImageMain' : 'detailImage'}
                key={image.id}
              >
                {image.signedUrl ? (
                  <Image
                    src={image.signedUrl}
                    alt={image.alt || item.title}
                    fill
                    priority={index === 0}
                    sizes={
                      index === 0
                        ? '(min-width: 980px) 65vw, 100vw'
                        : '(min-width: 980px) 30vw, 50vw'
                    }
                  />
                ) : (
                  <div className="mediaPlaceholder">Imagem</div>
                )}
              </article>
            ))}
          </div>

          <div className="publicDetailContent">
            <p className="eyebrow">Classificado em Salvador</p>
            <h1>{item.title}</h1>
            <strong className="detailPrice">
              {formatClassifiedPrice(item.price?.amountInCents ?? null)}
            </strong>

            <div className="detailFacts">
              <span>{classifiedConditionLabels[item.condition]}</span>
              <span>{formatClassifiedLocation(item.location)}</span>
            </div>

            <section className="detailDescription">
              <h2>Descrição</h2>
              <p>{item.description}</p>
            </section>
          </div>
        </div>

        <aside className="publicDetailSidebar">
          <div className="detailActionCard">
            <strong>{formatClassifiedPrice(item.price?.amountInCents ?? null)}</strong>
            <p>{formatClassifiedLocation(item.location)}</p>

            {isOwner ? (
              <Link
                className="primaryButton linkButton detailFullButton"
                href={`/classificados/${item.id}/editar`}
              >
                Gerenciar meu anúncio
              </Link>
            ) : (
              <>
                {query.erro === 'mensagem_invalida' && (
                  <div className="authFeedback authError" role="alert">
                    Escreva uma mensagem de até 1.500 caracteres.
                  </div>
                )}
                {query.erro === 'anuncio_proprio' && (
                  <div className="authFeedback authError" role="alert">
                    Você não pode iniciar uma conversa com o próprio anúncio.
                  </div>
                )}

                <form className="interestForm" action={conversationAction}>
                  <label>
                    Mensagem ao anunciante
                    <textarea
                      name="message"
                      rows={3}
                      minLength={1}
                      maxLength={1500}
                      required
                      defaultValue="Olá! Tenho interesse neste anúncio. Ainda está disponível?"
                    />
                  </label>
                  <button className="primaryButton" type="submit">
                    Tenho interesse
                  </button>
                </form>
              </>
            )}

            <form action={favoriteAction}>
              <button
                className={isFavorite ? 'ghostButton' : 'ghostButton'}
                type="submit"
              >
                {isFavorite ? 'Remover dos favoritos' : '♡ Salvar nos favoritos'}
              </button>
            </form>
          </div>

          <div className="detailSafetyCard">
            <strong>Negocie com cuidado</strong>
            <p>
              Não faça pagamentos antecipados sem verificar o item e o anunciante.
              O Achegue-se não mostra endereço exato publicamente.
            </p>
          </div>
        </aside>
      </section>

      <MobileTabbar />
    </main>
  );
}
