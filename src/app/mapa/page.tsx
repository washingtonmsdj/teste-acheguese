import type { Metadata } from 'next';
import Link from 'next/link';
import { territoryReleaseScope } from '@/config/territory-release-scope';
import {
  parseMapUrlState,
  type MapUrlParams,
  type MapViewportData,
} from '@/core/map';
import { reportServerError } from '@/core/observability/server-log';
import { getTerritorySurfaceVisibility } from '@/features/territory-home/server/territory-rollout-visibility';
import { TerritoryMapExplorer } from '@/integrations/map/territory-map-explorer';
import { SupabaseMapDataRepository } from '@/lib/supabase/map-data-repository';
import { createSupabasePublicServerClient } from '@/lib/supabase/public-server';
import { getSiteUrl } from '@/lib/site-url';
import { TerritoryAppShell } from '@/shared/layout/territory-app-shell';
import styles from './mapa.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const visibility =
    await getTerritorySurfaceVisibility();
  const canIndex =
    Boolean(getSiteUrl()) && visibility.isPublic;

  return {
    title: 'Mapa do território',
    description:
      `Explore bairros, escolas e unidades SUS verificadas em ${territoryReleaseScope.group.name}.`,
    alternates: canIndex
      ? {
          canonical: '/mapa',
        }
      : undefined,
    robots: {
      index: canIndex,
      follow: true,
    },
  };
}

type MapaPageProps = {
  searchParams: Promise<MapUrlParams>;
};

function MapUnavailable({
  message,
}: {
  message: string;
}) {
  return (
    <TerritoryAppShell
      activeId="map"
      territoryName={territoryReleaseScope.group.name}
      immersive
    >
      <main>
        <section className={styles.unavailable}>
          <div className="container">
            <div className={styles.unavailableCard}>
              <p className="eyebrow">Mapa territorial</p>
              <h1>Mapa temporariamente indisponível</h1>
              <p>{message}</p>
              <div className={styles.unavailableActions}>
                <Link
                  className="primaryButton linkButton"
                  href="/mapa"
                >
                  Tentar novamente
                </Link>
                <Link
                  className="ghostButton linkButton"
                  href="/"
                >
                  Voltar ao território
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </TerritoryAppShell>
  );
}

export default async function MapaPage({
  searchParams,
}: MapaPageProps) {
  const supabase = createSupabasePublicServerClient();

  if (!supabase) {
    return (
      <MapUnavailable message="O mapa não está disponível agora. Você ainda pode consultar o território e tentar novamente em instantes." />
    );
  }

  const initialState = parseMapUrlState(
    await searchParams,
    {
      bounds: { ...territoryReleaseScope.map.bounds },
      zoom: territoryReleaseScope.map.zoom,
      categories: [...territoryReleaseScope.map.categories],
    },
  );

  const repository = new SupabaseMapDataRepository(supabase);
  let initialData: MapViewportData | null = null;

  try {
    initialData = await repository.loadViewport({
      bounds: initialState.bounds,
      zoom: initialState.zoom,
      layers: initialState.categories.length
        ? ['boundaries', 'public_places']
        : ['boundaries'],
      publicPlaceCategories: initialState.categories.length
        ? initialState.categories
        : undefined,
      placeLimit: 200,
      boundaryLimit: 100,
    });
  } catch (error) {
    reportServerError(
      'territory.map.initial_load_failed',
      error,
      {
        zoom: initialState.zoom,
        categoryCount:
          initialState.categories.length,
      },
    );
  }

  if (!initialData) {
    return (
      <MapUnavailable message="Não conseguimos carregar o mapa agora. Tente novamente em instantes ou volte ao território." />
    );
  }

  return (
    <TerritoryAppShell
      activeId="map"
      territoryName={territoryReleaseScope.group.name}
      immersive
    >
      <main className={styles.page}>
        <TerritoryMapExplorer
          territoryName={territoryReleaseScope.group.name}
          initialData={initialData}
          initialZoom={initialState.zoom}
          initialCategories={initialState.categories}
        />
      </main>
    </TerritoryAppShell>
  );
}
