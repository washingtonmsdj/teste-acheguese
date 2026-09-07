import type { Metadata } from 'next';
import { MobileTabbar } from '@/shared/layout/mobile-tabbar';
import { SiteHeader } from '@/shared/layout/site-header';
import { SupabaseMapDataRepository } from '@/lib/supabase/map-data-repository';
import { createSupabasePublicServerClient } from '@/lib/supabase/public-server';
import { TerritoryMapExplorer } from '@/integrations/map/territory-map-explorer';
import styles from './mapa.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mapa do território',
  description:
    'Explore bairros, escolas e unidades SUS verificadas no Complexo do Nordeste de Amaralina.',
};

const COMPLEXO_BOUNDS = {
  west: -38.4873837606422,
  south: -13.0134576151743,
  east: -38.4668939364098,
  north: -12.9958446983238,
} as const;

export default async function MapaPage() {
  const supabase = createSupabasePublicServerClient();

  if (!supabase) {
    return (
      <main>
        <SiteHeader />
        <section className={styles.unavailable}>
          <div className="container">
            <p className="eyebrow">Mapa territorial</p>
            <h1>Mapa temporariamente indisponível</h1>
            <p>
              A configuração pública de dados ainda não está
              disponível neste ambiente.
            </p>
          </div>
        </section>
        <MobileTabbar />
      </main>
    );
  }

  const repository = new SupabaseMapDataRepository(supabase);
  const initialData = await repository.loadViewport({
    bounds: COMPLEXO_BOUNDS,
    zoom: 14,
    layers: ['boundaries', 'public_places'],
    publicPlaceCategories: ['education', 'health'],
    placeLimit: 200,
    boundaryLimit: 100,
  });

  return (
    <main className={styles.page}>
      <SiteHeader />
      <TerritoryMapExplorer
        initialData={initialData}
        initialZoom={14}
      />
      <MobileTabbar />
    </main>
  );
}
