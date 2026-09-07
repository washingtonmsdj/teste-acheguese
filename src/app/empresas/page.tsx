import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/shared/layout/site-header';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';

export const metadata: Metadata = {
  title: 'Para empresas',
  description: 'Conheça a proposta do Achegue-se para negócios locais.',
};

export default function BusinessesPage() {
  return (
    <main>
      <SiteHeader />
      <section className="internalHero">
        <div className="container narrow">
          <p className="eyebrow">Para empresas</p>
          <h1>Presença local que ajuda clientes a encontrar você.</h1>
          <p>
            Esta vertical será desenvolvida depois de Classificados. A arquitetura compartilhada
            já reserva identidade, localização, mídia e moderação para evitar retrabalho.
          </p>
          <Link className="primaryButton linkButton" href="/classificados">Ver primeiro MVP</Link>
        </div>
      </section>
      <MobileTabbar />
    </main>
  );
}
