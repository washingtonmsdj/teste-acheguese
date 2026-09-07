import type { Metadata } from 'next';
import {
  TerritoryHome,
  TerritoryHomeUnavailable,
} from '@/features/territory-home/components/territory-home';
import { loadTerritoryHomeData } from '@/features/territory-home/server/load-territory-home';
import { createSupabasePublicServerClient } from '@/lib/supabase/public-server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Território, dados e mapa local',
  description:
    'Explore dados públicos verificados, mapa e serviços do Complexo do Nordeste de Amaralina em Salvador.',
};

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

  try {
    const data = await loadTerritoryHomeData(
      supabase,
      requestedNeighborhoodSlug,
    );

    return <TerritoryHome data={data} />;
  } catch {
    return <TerritoryHomeUnavailable />;
  }
}
