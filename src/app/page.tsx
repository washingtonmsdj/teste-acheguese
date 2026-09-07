import type { Metadata } from 'next';
import {
  TerritoryHome,
  TerritoryHomeUnavailable,
} from '@/features/territory-home/components/territory-home';
import { loadTerritoryHomeData } from '@/features/territory-home/server/load-territory-home';
import { getTerritorySurfaceVisibility } from '@/features/territory-home/server/territory-rollout-visibility';
import type { TerritoryHomeData } from '@/features/territory-home/types';
import { createSupabasePublicServerClient } from '@/lib/supabase/public-server';
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

function firstString(
  value: string | string[] | undefined,
) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({
  searchParams,
}: HomePageProps) {
  const supabase = createSupabasePublicServerClient();

  if (!supabase) {
    return <TerritoryHomeUnavailable />;
  }

  const requestedNeighborhoodSlug = firstString(
    (await searchParams).bairro,
  );

  let data: TerritoryHomeData;

  try {
    data = await loadTerritoryHomeData(
      supabase,
      requestedNeighborhoodSlug,
    );
  } catch {
    return <TerritoryHomeUnavailable />;
  }

  return <TerritoryHome data={data} />;
}
