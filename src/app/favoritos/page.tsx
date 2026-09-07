import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { toggleFavoriteAction } from '@/app/classificados/favorite-actions';
import { ClassifiedCard } from '@/modules/classifieds/components/classified-card';
import { SupabaseClassifiedsRepository } from '@/modules/classifieds/data/supabase-classifieds-repository';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Favoritos',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function FavoritesPage() {
  if (!getSupabasePublicConfig()) {
    redirect('/entrar?erro=indisponivel&next=/favoritos');
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (typeof userId !== 'string') {
    redirect('/entrar?next=/favoritos');
  }

  const { data: favorites, error: favoritesError } = await supabase
    .from('classified_favorites')
    .select('classified_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (favoritesError) throw favoritesError;

  const favoriteIds = favorites?.map((item) => item.classified_id) ?? [];
  const repository = new SupabaseClassifiedsRepository(supabase);
  const publishedItems = await repository.findPublishedByIds(favoriteIds);
  const byId = new Map(publishedItems.map((item) => [item.id, item]));
  const items = favoriteIds
    .map((id) => byId.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const signedPairs = await Promise.all(
    items.map(async (item) => {
      if (!item.cover) return [item.id, null] as const;

      const { data } = await supabase.storage
        .from('classified-media')
        .createSignedUrl(item.cover.storageKey, 3600);

      return [item.id, data?.signedUrl ?? null] as const;
    }),
  );

  const imageUrls = Object.fromEntries(signedPairs);

  return (
    <main>
      <SiteHeader />

      <section className="internalHero compactInternalHero">
        <div className="container narrow">
          <p className="eyebrow">Sua conta</p>
          <h1>Favoritos</h1>
          <p>Guarde anúncios publicados para encontrar de novo com facilidade.</p>
          <Link className="primaryButton linkButton" href="/classificados">
            Explorar Classificados
          </Link>
        </div>
      </section>

      <section className="section container">
        {items.length ? (
          <div className="publicClassifiedGrid">
            {items.map((item) => {
              const removeAction = toggleFavoriteAction.bind(
                null,
                item.id,
                '/favoritos',
              );

              return (
                <div className="favoriteCardWrap" key={item.id}>
                  <ClassifiedCard
                    item={item}
                    imageUrl={imageUrls[item.id] ?? null}
                  />
                  <form action={removeAction}>
                    <button className="favoriteRemoveButton" type="submit">
                      Remover dos favoritos
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="classifiedEmptyState">
            <span className="emptyIcon" aria-hidden="true">♡</span>
            <div>
              <h3>Você ainda não salvou nenhum anúncio.</h3>
              <p>
                Quando encontrar algo interessante, use “Salvar nos favoritos”.
              </p>
            </div>
            <Link className="primaryButton linkButton" href="/classificados">
              Explorar anúncios
            </Link>
          </div>
        )}
      </section>

      <MobileTabbar />
    </main>
  );
}
