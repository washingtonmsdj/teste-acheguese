import Link from 'next/link';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';
import { SiteHeader } from '@/shared/layout/site-header';

export const metadata = {
  title: 'Busca territorial',
  description:
    'A busca geral do Achegue-se será habilitada por etapas, sem exibir categorias ou serviços ainda não lançados.',
};

export default function SearchPage() {
  return (
    <main>
      <SiteHeader />
      <section className="internalHero">
        <div className="container narrow">
          <p className="eyebrow">Busca territorial</p>
          <h1>A busca geral entra quando houver dados reais para responder.</h1>
          <p>
            Por enquanto, use o mapa para consultar o
            território verificado ou a busca própria de
            Classificados. O Achegue-se não mostra categorias
            futuras como se já estivessem disponíveis.
          </p>
          <div className="stateActions">
            <Link
              className="primaryButton linkButton"
              href="/mapa"
            >
              Explorar mapa
            </Link>
            <Link
              className="ghostButton linkButton"
              href="/classificados"
            >
              Buscar em Classificados
            </Link>
          </div>
        </div>
      </section>
      <MobileTabbar />
    </main>
  );
}
