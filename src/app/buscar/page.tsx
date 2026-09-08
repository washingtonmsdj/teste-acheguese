import type { Metadata } from 'next';
import Link from 'next/link';
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';

export const metadata: Metadata = {
  title: 'Buscar no Achegue-se',
  description:
    'Encontre informações do território pelo mapa ou pesquise anúncios em Classificados.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  return (
    <TerritoryAppShell
      activeId="territory"
      territoryName="Complexo do Nordeste de Amaralina"
    >
      <main>
        <section className="internalHero">
        <div className="container narrow">
          <p className="eyebrow">Buscar no Achegue-se</p>
          <h1>Encontre o que já está disponível perto de você.</h1>
          <p>
            Para escolas, unidades SUS e bairros, use o mapa
            territorial. Para produtos e anúncios, pesquise
            diretamente em Classificados.
          </p>
          <div className="stateActions">
            <Link
              className="primaryButton linkButton"
              href="/mapa"
            >
              Buscar no mapa
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
      </main>
    </TerritoryAppShell>
  );
}
