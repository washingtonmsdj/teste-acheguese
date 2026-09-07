import type { Metadata } from 'next';
import {
  parseMapUrlState,
  type MapUrlParams,
  type MapViewportData,
} from '@/core/map';
import { getTerritorySurfaceVisibility } from '@/features/territory-home/server/territory-rollout-visibility';
import { TerritoryMapExplorer } from '@/integrations/map/territory-map-explorer';
import { SupabaseMapDataRepository } from '@/lib/supabase/map-data-repository';
import { createSupabasePublicServerClient } from '@/lib/supabase/public-server';
import { getSiteUrl } from '@/lib/site-url';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';
import { SiteHeader } from '@/shared/layout/site-header';
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
      'Explore bairros, escolas e unidades SUS verificadas no Complexo do Nordeste de Amaralina.',
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

const DEFAULT_MAP_STATE = {
  bounds: {
    west: -38.4873837606422,
    south: -13.0134576151743,
    east: -38.4668939364098,
    north: -12.9958446983238,
  },
  zoom: 14,
  categories: ['education', 'health'],
} as const;

type MapaPageProps = {
  searchParams: Promise<MapUrlParams>;
};

function MapUnavailable({
  message,
}: {
  message: string;
}) {
  return (
    <main>
      <SiteHeader />
      <section className={styles.unavailable}>
        <div className="container">
          <p className="eyebrow">Mapa territorial</p>
          <h1>Mapa temporariamente indisponível</h1>
          <p>{message}</p>
        </div>
      </section>
      <MobileTabbar />
    </main>
  );
}

export default async function MapaPage({
  searchParams,
}: MapaPageProps) {
  const supabase = createSupabasePublicServerClient();

  if (!supabase) {
    return (
      <MapUnavailable message="A configuração pública de dados ainda não está disponível neste ambiente." />
    );
  }

  const initialState = parseMapUrlState(
    await searchParams,
    {
      bounds: DEFAULT_MAP_STATE.bounds,
      zoom: DEFAULT_MAP_STATE.zoom,
      categories: [...DEFAULT_MAP_STATE.categories],
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
  } catch {
    initialData = null;
  }

  if (!initialData) {
    return (
      <MapUnavailable message="Não foi possível carregar os dados territoriais agora. Nenhum dado de demonstração foi usado como substituto." />
    );
  }

  return (
    <main className={styles.page}>
      <SiteHeader />
      <TerritoryMapExplorer
        initialData={initialData}
        initialZoom={initialState.zoom}
        initialCategories={initialState.categories}
      />
      <MobileTabbar />
    </main>
  );
}
