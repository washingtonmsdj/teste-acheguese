import { unstable_cache } from 'next/cache';
import type { TerritoryHomeData } from '@/features/territory-home/types';
import { createSupabasePublicServerClient } from '@/lib/supabase/public-server';
import { loadTerritoryHomeData } from './load-territory-home';

const loadCachedSnapshot = unstable_cache(
  async (
    requestedNeighborhoodSlug: string | null,
  ): Promise<TerritoryHomeData> => {
    const supabase = createSupabasePublicServerClient();

    if (!supabase) {
      throw new Error(
        'territory_home_config_unavailable',
      );
    }

    return loadTerritoryHomeData(
      supabase,
      requestedNeighborhoodSlug ?? undefined,
    );
  },
  ['territory-home-snapshot'],
  {
    // Mantém o estado visual da Home coerente com o
    // cache de rollout/SEO, também de 60 segundos.
    revalidate: 60,
    tags: ['territory-home-data'],
  },
);

export function loadCachedTerritoryHomeData(
  requestedNeighborhoodSlug?: string,
) {
  return loadCachedSnapshot(
    requestedNeighborhoodSlug ?? null,
  );
}
