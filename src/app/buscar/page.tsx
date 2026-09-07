import Link from 'next/link';
import { CategoryGrid } from '@/features/discovery/components/category-grid';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
  }>;
};

export const metadata = {
  title: 'Buscar',
  description: 'Explore negócios, serviços e oportunidades na sua região.',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, categoria } = await searchParams;
  const context = q?.trim() || categoria?.trim();

  return (
    <main>
      <SiteHeader />
      <section className="internalHero">
        <div className="container narrow">
          <p className="eyebrow">Explorar</p>
          <h1>{context ? `Resultados para “${context}”` : 'O que você procura na sua região?'}</h1>
          <p>
            A busca já tem sua rota e contrato de URL. A indexação geográfica real entra
            junto com a camada de dados do primeiro vertical.
          </p>
          <Link className="primaryButton linkButton" href="/classificados">
            Ver Classificados
          </Link>
        </div>
      </section>
      <section className="section container">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Categorias</p>
            <h2>Explore outras opções</h2>
          </div>
        </div>
        <CategoryGrid />
      </section>
      <MobileTabbar />
    </main>
  );
}
