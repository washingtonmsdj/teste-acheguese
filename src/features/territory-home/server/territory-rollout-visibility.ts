import { unstable_cache } from 'next/cache';
import {
  isPublicTerritoryStage,
  type TerritoryRolloutStage,
} from '@/core/territory';
import { createSupabasePublicServerClient } from '@/lib/supabase/public-server';
import { SupabaseTerritoryRolloutRepository } from '@/lib/supabase/territory-rollout-repository';

const COMPLEXO_SLUG =
  'complexo-do-nordeste-de-amaralina';

export type TerritorySurfaceVisibility = {
  stage: TerritoryRolloutStage | null;
  isPublic: boolean;
};

async function readTerritorySurfaceVisibility(): Promise<TerritorySurfaceVisibility> {
  const supabase = createSupabasePublicServerClient();

  if (!supabase) {
    return {
      stage: null,
      isPublic: false,
    };
  }

  const repository =
    new SupabaseTerritoryRolloutRepository(supabase);
  const rollouts =
    await repository.findBySlug(COMPLEXO_SLUG);
  const groupRollout = rollouts.find(
    (rollout) => rollout.targetKind === 'group',
  );

  if (!groupRollout) {
    return {
      stage: null,
      isPublic: false,
    };
  }

  return {
    stage: groupRollout.stage,
    isPublic: isPublicTerritoryStage(
      groupRollout.stage,
    ),
  };
}

export const getTerritorySurfaceVisibility =
  unstable_cache(
    readTerritorySurfaceVisibility,
    ['territory-surface-visibility', COMPLEXO_SLUG],
    {
      revalidate: 60,
      tags: ['territory-rollout'],
    },
  );
