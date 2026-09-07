import type { Metadata } from 'next';
import Link from 'next/link';
import { ClassifiedCategoryNav } from '@/features/classifieds/components/category-nav';
import { ClassifiedsEmptyState } from '@/features/classifieds/components/empty-state';
import {
  classifiedCategories,
  isClassifiedCategoryId,
} from '@/features/classifieds/domain/categories';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

export const metadata: Metadata = {
  title: 'Classificados',
  description: 'Classificados locais do Achegue-se: encontre e anuncie perto de você.',
};

type ClassifiedsPageProps = {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
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
  const category = activeCategory
    ? classifiedCategories.find((item) => item.id === activeCategory)
    : undefined;
  const hasFilters = Boolean(query || activeCategory);

  return (
    <main>
      <SiteHeader />

      <section className="classifiedHero">
        <div className="container classifiedHeroGrid">
          <div>
            <p className="eyebrow">Classificados Achegue-se</p>
            <h1>Compre e venda <em>perto de você.</em></h1>
            <p>
              Encontre oportunidades da sua região e publique de forma simples,
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
            <span>Anuncie no seu bairro</span>
            <strong>Venda algo sem complicação.</strong>
            <p>Fotos, categoria, preço e região em um fluxo direto e mobile-first.</p>
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
              <p className="eyebrow">Anúncios</p>
              <h2>
                {category
                  ? category.label
                  : query
                    ? `Resultados para “${query}”`
                    : 'Perto de você'}
              </h2>
            </div>
            <span>0 resultados</span>
          </div>

          <ClassifiedsEmptyState
            query={query}
            hasFilters={hasFilters}
          />
        </div>
      </section>

      <section className="classifiedTrust">
        <div className="container trustGrid">
          <div><span>✓</span><strong>Contexto local</strong><small>Descoberta por cidade e região.</small></div>
          <div><span>✓</span><strong>Privacidade</strong><small>Endereço exato não é público por padrão.</small></div>
          <div><span>✓</span><strong>Moderação</strong><small>Denúncias e revisão fazem parte do MVP.</small></div>
        </div>
      </section>

      <MobileTabbar />
    </main>
  );
}
