import type { Metadata } from 'next';
import { territoryReleaseScope } from '@/config/territory-release-scope';
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
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';

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

function ClassifiedsContextRail({
  resultCount,
  query,
  categoryLabel,
}: {
  resultCount: number;
  query?: string;
  categoryLabel?: string;
}) {
  const currentLabel =
    categoryLabel ??
    (query ? `Busca por “${query}”` : 'Todos os anúncios');

  return (
    <div className="classifiedRailStack">
      <section className="classifiedRailCard">
        <span className="classifiedRailEyebrow">Recorte atual</span>
        <h2>{currentLabel}</h2>
        <p>{territoryReleaseScope.city.name} · {territoryReleaseScope.city.stateCode}</p>
        <div className="classifiedRailMetric">
          <strong>{resultCount}</strong>
          <span>
            {resultCount === 1
              ? 'resultado nesta página'
              : 'resultados nesta página'}
          </span>
        </div>
      </section>

      <section className="classifiedRailCard">
        <span className="classifiedRailEyebrow">Sua área</span>
        <nav
          className="classifiedRailLinks"
          aria-label="Atalhos de Classificados"
        >
          <Link href="/classificados/novo">
            <span>Criar anúncio</span>
            <b aria-hidden="true">→</b>
          </Link>
          <Link href="/classificados/meus">
            <span>Meus anúncios</span>
            <b aria-hidden="true">→</b>
          </Link>
          <Link href="/favoritos">
            <span>Favoritos</span>
            <b aria-hidden="true">→</b>
          </Link>
          <Link href="/mensagens">
            <span>Mensagens</span>
            <b aria-hidden="true">→</b>
          </Link>
        </nav>
      </section>

      <section className="classifiedRailCard classifiedRailTrust">
        <span className="classifiedRailEyebrow">Negociação local</span>
        <strong>Privacidade e moderação.</strong>
        <p>
          Endereço exato não é público por padrão e anúncios
          só entram na área pública após aprovação.
        </p>
      </section>
    </div>
  );
}

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
    <TerritoryAppShell
      activeId="classifieds"
      territoryName="Salvador"
      contextRail={
        <ClassifiedsContextRail
          resultCount={items.length}
          query={query}
          categoryLabel={category?.label}
        />
      }
    >
      <main>
        <section className="classifiedHero">
        <div className="container classifiedHeroGrid">
          <div>
            <p className="eyebrow">Classificados locais</p>
            <h1>Encontre e anuncie <em>perto de você.</em></h1>
            <p>
              Produtos e anúncios em Salvador, com localização informada,
              favoritos e conversa dentro do Achegue-se.
            </p>

            <form className="classifiedSearch" action="/classificados">
              <label className="srOnly" htmlFor="classified-search">
                Buscar classificados
              </label>
              <input
                id="classified-search"
                name="q"
                defaultValue={query}
                placeholder="Buscar produto ou anúncio"
                autoComplete="off"
              />
              {activeCategory && (
                <input type="hidden" name="categoria" value={activeCategory} />
              )}
              <button className="searchButton" type="submit">Buscar</button>
            </form>
          </div>

          <aside className="classifiedPitch">
            <span>Quer anunciar?</span>
            <strong>Comece por um rascunho.</strong>
            <p>
              Informe os dados principais, adicione fotos e envie
              para revisão antes de ficar público.
            </p>
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
            <p>Escolha uma categoria ou pesquise pelo que precisa.</p>
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
              <p className="eyebrow">{territoryReleaseScope.city.name} · {territoryReleaseScope.city.stateCode}</p>
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
          <div><span>✓</span><strong>Território claro</strong><small>Os anúncios exibem a área informada sem presumir sua localização.</small></div>
          <div><span>✓</span><strong>Privacidade</strong><small>Endereço exato não é público por padrão.</small></div>
          <div><span>✓</span><strong>Moderação</strong><small>Só anúncios aprovados aparecem na área pública.</small></div>
        </div>
        </section>
      </main>
    </TerritoryAppShell>
  );
}
