import { unstable_cache } from 'next/cache';
import {
  isPublicTerritoryStage,
  type TerritoryRolloutStage,
} from '@/core/territory';
import { reportServerError } from '@/core/observability/server-log';
import { createSupabasePublicServerClient } from '@/lib/supabase/public-server';
import { SupabaseTerritoryRolloutRepository } from '@/lib/supabase/territory-rollout-repository';

const COMPLEXO_SLUG =
  'complexo-do-nordeste-de-amaralina';

export type TerritorySurfaceVisibility = {
  stage: TerritoryRolloutStage | null;
  isPublic: boolean;
};

const HIDDEN_VISIBILITY: TerritorySurfaceVisibility = {
  stage: null,
  isPublic: false,
};

async function readTerritorySurfaceVisibility(): Promise<TerritorySurfaceVisibility> {
  const supabase = createSupabasePublicServerClient();

  if (!supabase) {
    return HIDDEN_VISIBILITY;
  }

  try {
    const repository =
      new SupabaseTerritoryRolloutRepository(supabase);
    const rollouts =
      await repository.findBySlug(COMPLEXO_SLUG);
    const groupRollout = rollouts.find(
      (rollout) => rollout.targetKind === 'group',
    );

    if (!groupRollout) {
      reportServerError(
        'territory.rollout.group_missing',
        new Error('territory_rollout_group_missing'),
      );
      return HIDDEN_VISIBILITY;
    }

    return {
      stage: groupRollout.stage,
      isPublic: isPublicTerritoryStage(
        groupRollout.stage,
      ),
    };
  } catch (error) {
    reportServerError(
      'territory.rollout.read_failed',
      error,
    );
    return HIDDEN_VISIBILITY;
  }
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
