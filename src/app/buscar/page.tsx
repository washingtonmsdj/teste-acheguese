import type { Metadata } from 'next';
import { territoryReleaseScope } from '@/config/territory-release-scope';
import Link from 'next/link';
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';
import { NavigationIcon } from '@/shared/navigation/navigation-icon';

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
      territoryName={territoryReleaseScope.group.name}
    >
      <main className="searchHub">
        <section className="searchHero">
          <div className="container searchHeroInner">
            <div className="searchHeroCopy">
              <div className="searchAvailability">
                <span aria-hidden="true" />
                Disponível agora no território
              </div>
              <p className="eyebrow">Buscar no Achegue-se</p>
              <h1>
                Encontre pelo <em>território</em>, não por
                uma lista genérica.
              </h1>
              <p>
                Escolha onde procurar. O mapa organiza
                informação pública; Classificados reúne
                anúncios em uma área separada.
              </p>
            </div>

            <Link className="searchTerritoryCard" href="/">
              <span className="searchTerritoryIcon">
                <NavigationIcon name="home" />
              </span>
              <span>
                <small>Território atual</small>
                <strong>
                  {territoryReleaseScope.group.name}
                </strong>
                <em>
                  {territoryReleaseScope.city.name} · {territoryReleaseScope.city.stateCode}
                </em>
              </span>
              <b aria-hidden="true">→</b>
            </Link>
          </div>
        </section>

        <section className="container searchChoices" aria-label="Onde buscar">
          <Link className="searchChoiceCard searchChoiceMap" href="/mapa">
            <span className="searchChoiceIcon">
              <NavigationIcon name="map" />
            </span>
            <div>
              <span className="searchChoiceEyebrow">
                Informação pública
              </span>
              <h2>Mapa territorial</h2>
              <p>
                Encontre escolas, unidades SUS, limites e
                bairros na área que você estiver explorando.
              </p>
            </div>
            <ul aria-label="Conteúdo disponível no mapa">
              <li>Educação</li>
              <li>Saúde SUS</li>
              <li>Bairros</li>
            </ul>
            <strong className="searchChoiceAction">
              Explorar mapa <span aria-hidden="true">↗</span>
            </strong>
          </Link>

          <Link
            className="searchChoiceCard searchChoiceClassifieds"
            href="/classificados"
          >
            <span className="searchChoiceIcon">
              <NavigationIcon name="tag" />
            </span>
            <div>
              <span className="searchChoiceEyebrow">
                Serviço local
              </span>
              <h2>Classificados</h2>
              <p>
                Pesquise produtos e anúncios com categoria,
                preço e localização informada pelo anunciante.
              </p>
            </div>
            <ul aria-label="Conteúdo disponível em Classificados">
              <li>Produtos</li>
              <li>Categorias</li>
              <li>Local informado</li>
            </ul>
            <strong className="searchChoiceAction">
              Ver anúncios <span aria-hidden="true">↗</span>
            </strong>
          </Link>
        </section>

        <section className="container searchGuidance">
          <span className="searchGuidanceIcon">
            <NavigationIcon name="search" />
          </span>
          <div>
            <strong>Cada busca usa o conteúdo certo.</strong>
            <p>
              O mapa mantém informação pública separada dos
              anúncios, para você entender sempre o que está
              consultando.
            </p>
          </div>
        </section>
      </main>
    </TerritoryAppShell>
  );
}
