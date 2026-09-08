import { unstable_cache } from 'next/cache';
import { territoryReleaseScope } from '@/config/territory-release-scope';
import { reportServerError } from '@/core/observability/server-log';
import {
  HIDDEN_TERRITORY_SURFACE,
  resolveTerritorySurfaceVisibility,
  type TerritorySurfaceVisibility,
} from '@/features/territory-home/domain/surface-visibility';
import { createSupabasePublicServerClient } from '@/lib/supabase/public-server';
import { SupabaseTerritoryRolloutRepository } from '@/lib/supabase/territory-rollout-repository';

async function readTerritorySurfaceVisibility(): Promise<TerritorySurfaceVisibility> {
  const supabase = createSupabasePublicServerClient();

  if (!supabase) {
    return HIDDEN_TERRITORY_SURFACE;
  }

  try {
    const repository =
      new SupabaseTerritoryRolloutRepository(supabase);
    const rollouts =
      await repository.findBySlug(territoryReleaseScope.group.slug);
    const groupRollout = rollouts.find(
      (rollout) => rollout.targetKind === 'group',
    );

    if (!groupRollout) {
      reportServerError(
        'territory.rollout.group_missing',
        new Error('territory_rollout_group_missing'),
      );
      return HIDDEN_TERRITORY_SURFACE;
    }

    return resolveTerritorySurfaceVisibility(
      groupRollout.stage,
    );
  } catch (error) {
    reportServerError(
      'territory.rollout.read_failed',
      error,
    );
    return HIDDEN_TERRITORY_SURFACE;
  }
}

export const getTerritorySurfaceVisibility =
  unstable_cache(
    readTerritorySurfaceVisibility,
    ['territory-surface-visibility', territoryReleaseScope.group.slug],
    {
      revalidate: 60,
      tags: ['territory-rollout'],
    },
  );
