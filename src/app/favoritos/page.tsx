import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

export const metadata: Metadata = {
  title: 'Favoritos',
};

export default function FavoritesPage() {
  return (
    <main>
      <SiteHeader />
      <section className="internalHero">
        <div className="container narrow">
          <p className="eyebrow">Favoritos</p>
          <h1>Guarde o que vale voltar a ver.</h1>
          <p>
            Favoritos será ativado junto com autenticação no MVP de Classificados.
          </p>
          <Link className="primaryButton linkButton" href="/classificados">
            Explorar Classificados
          </Link>
        </div>
      </section>
      <MobileTabbar />
    </main>
  );
}
