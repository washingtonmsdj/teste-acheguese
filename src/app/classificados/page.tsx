import type { Metadata } from 'next';
import Link from 'next/link';
import { ClassifiedCategoryNav } from '@/modules/classifieds/components/category-nav';
import { ClassifiedCard } from '@/modules/classifieds/components/classified-card';
import { ClassifiedsEmptyState } from '@/modules/classifieds/components/empty-state';
import { SupabaseClassifiedsRepository } from '@/modules/classifieds/data/supabase-classifieds-repository';
import {
  classifiedCategories,
  isClassifiedCategoryId,
} from '@/modules/classifieds/domain/categories';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { getSiteUrl } from '@/lib/site-url';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Classificados',
  description:
    'Classificados locais do Achegue-se em Salvador: encontre e anuncie perto de você.',
  alternates: siteUrl
    ? {
        canonical: '/classificados',
      }
    : undefined,
  robots: {
    index: Boolean(siteUrl),
    follow: true,
  },
};

type ClassifiedsPageProps = {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    cursor?: string;
  }>;
};

export default async function ClassifiedsPage({
  searchParams,
}: ClassifiedsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim().slice(0, 120) || undefined;
  const activeCategory =
    params.categoria && isClassifiedCategoryId(params.categoria)
      ? params.categoria
      : undefined;
  const cursor = params.cursor?.trim() || undefined;
  const category = activeCategory
    ? classifiedCategories.find((item) => item.id === activeCategory)
    : undefined;
  const hasFilters = Boolean(query || activeCategory);

  let items: Awaited<ReturnType<SupabaseClassifiedsRepository['search']>>['items'] = [];
  let nextCursor: string | null = null;
  let imageUrls: Record<string, string | null> = {};

  if (getSupabasePublicConfig()) {
    const supabase = await createSupabaseServerClient();

    const { data: city, error: cityError } = await supabase
      .from('cities')
      .select('id')
      .eq('slug', 'salvador')
      .eq('state_code', 'BA')
      .eq('is_active', true)
      .maybeSingle();

    if (cityError) throw cityError;

    const repository = new SupabaseClassifiedsRepository(supabase);
    const result = await repository.search({
      query,
      categoryId: activeCategory,
      cityId: city ? String(city.id) : undefined,
      cursor,
      limit: 24,
    });

    items = result.items;
    nextCursor = result.nextCursor;

    const signedPairs = await Promise.all(
      items.map(async (item) => {
        if (!item.cover) {
          return [item.id, null] as const;
        }

        const { data } = await supabase.storage
          .from('classified-media')
          .createSignedUrl(item.cover.storageKey, 3600);

        return [item.id, data?.signedUrl ?? null] as const;
      }),
    );

    imageUrls = Object.fromEntries(signedPairs);
  }

  const nextParams = new URLSearchParams();
  if (query) nextParams.set('q', query);
  if (activeCategory) nextParams.set('categoria', activeCategory);
  if (nextCursor) nextParams.set('cursor', nextCursor);

  return (
    <main>
      <SiteHeader />

      <section className="classifiedHero">
        <div className="container classifiedHeroGrid">
          <div>
            <p className="eyebrow">Classificados · Salvador</p>
            <h1>Compre e venda <em>na sua cidade.</em></h1>
            <p>
              Encontre oportunidades em Salvador e publique de forma simples,
              com foco em clareza, segurança e moderação.
            </p>

            <form className="classifiedSearch" action="/classificados">
              <label className="srOnly" htmlFor="classified-search">
                Buscar classificados
              </label>
              <input
                id="classified-search"
                name="q"
                defaultValue={query}
                placeholder="O que você está procurando?"
                autoComplete="off"
              />
              {activeCategory && (
                <input type="hidden" name="categoria" value={activeCategory} />
              )}
              <button className="searchButton" type="submit">Buscar</button>
            </form>
          </div>

          <aside className="classifiedPitch">
            <span>Venda em Salvador</span>
            <strong>Publique sem complicação.</strong>
            <p>Fotos, categoria, preço e bairro em um fluxo direto e mobile-first.</p>
            <Link className="primaryButton linkButton" href="/classificados/novo">
              Criar anúncio
            </Link>
          </aside>
        </div>
      </section>

      <section className="section container">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Explorar</p>
            <h2>Categorias</h2>
            <p>Escolha uma categoria ou faça uma busca direta.</p>
          </div>
          {hasFilters && <Link href="/classificados">Limpar filtros →</Link>}
        </div>

        <ClassifiedCategoryNav
          activeCategory={activeCategory}
          query={query}
        />
      </section>

      <section className="section sectionSoft">
        <div className="container">
          <div className="classifiedResultsHeader">
            <div>
              <p className="eyebrow">Salvador · BA</p>
              <h2>
                {category
                  ? category.label
                  : query
                    ? `Resultados para “${query}”`
                    : 'Anúncios publicados'}
              </h2>
            </div>
            <span>
              {items.length === 1
                ? '1 resultado'
                : `${items.length} resultados nesta página`}
            </span>
          </div>

          {items.length > 0 ? (
            <>
              <div className="publicClassifiedGrid">
                {items.map((item) => (
                  <ClassifiedCard
                    item={item}
                    imageUrl={imageUrls[item.id] ?? null}
                    key={item.id}
                  />
                ))}
              </div>

              {nextCursor && (
                <div className="paginationBar">
                  <Link
                    className="ghostButton linkButton"
                    href={`/classificados?${nextParams.toString()}`}
                  >
                    Ver mais anúncios
                  </Link>
                </div>
              )}
            </>
          ) : (
            <ClassifiedsEmptyState
              query={query}
              hasFilters={hasFilters}
            />
          )}
        </div>
      </section>

      <section className="classifiedTrust">
        <div className="container trustGrid">
          <div><span>✓</span><strong>Território claro</strong><small>O MVP começa por Salvador, sem fingir localização automática.</small></div>
          <div><span>✓</span><strong>Privacidade</strong><small>Endereço exato não é público por padrão.</small></div>
          <div><span>✓</span><strong>Moderação</strong><small>Só anúncios aprovados aparecem na área pública.</small></div>
        </div>
      </section>

      <MobileTabbar />
    </main>
  );
}
