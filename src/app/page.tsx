import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { reportServerError } from '@/core/observability/server-log';
import {
  TerritoryHome,
  TerritoryHomeUnavailable,
} from '@/features/territory-home/components/territory-home';
import { parseTerritoryScopeQuery } from '@/features/territory-home/domain/scope-query';
import { loadCachedTerritoryHomeData } from '@/features/territory-home/server/load-cached-territory-home';
import { getTerritorySurfaceVisibility } from '@/features/territory-home/server/territory-rollout-visibility';
import type { TerritoryHomeData } from '@/features/territory-home/types';
import { getSiteUrl } from '@/lib/site-url';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const visibility =
    await getTerritorySurfaceVisibility();
  const canIndex =
    Boolean(getSiteUrl()) && visibility.isPublic;

  return {
    title: 'Território, dados e mapa local',
    description:
      'Explore dados públicos verificados, mapa e serviços do Complexo do Nordeste de Amaralina em Salvador.',
    alternates: canIndex
      ? {
          canonical: '/',
        }
      : undefined,
    robots: {
      index: canIndex,
      follow: true,
    },
  };
}

type HomePageProps = {
  searchParams: Promise<{
    bairro?: string | string[];
  }>;
};

export default async function Home({
  searchParams,
}: HomePageProps) {
  const scopeQuery = parseTerritoryScopeQuery(
    (await searchParams).bairro,
  );

  if (scopeQuery.kind === 'invalid') {
    redirect('/');
  }

  const requestedNeighborhoodSlug =
    scopeQuery.kind === 'neighborhood'
      ? scopeQuery.slug
      : undefined;

  let data: TerritoryHomeData | null = null;
  let invalidNeighborhood = false;
  let configurationUnavailable = false;

  try {
    data = await loadCachedTerritoryHomeData(
      requestedNeighborhoodSlug,
    );
  } catch (error) {
    invalidNeighborhood =
      error instanceof Error &&
      error.message ===
        'territory_home_neighborhood_invalid';
    configurationUnavailable =
      error instanceof Error &&
      error.message ===
        'territory_home_config_unavailable';

    if (configurationUnavailable) {
      reportServerError(
        'territory.home.config_unavailable',
        error,
        {
          scope:
            scopeQuery.kind === 'neighborhood'
              ? 'neighborhood'
              : 'group',
        },
      );
    } else if (!invalidNeighborhood) {
      reportServerError(
        'territory.home.load_failed',
        error,
        {
          scope:
            scopeQuery.kind === 'neighborhood'
              ? 'neighborhood'
              : 'group',
        },
      );
    }
  }

  if (invalidNeighborhood) {
    redirect('/');
  }

  if (!data) {
    return <TerritoryHomeUnavailable />;
  }

  return <TerritoryHome data={data} />;
}
