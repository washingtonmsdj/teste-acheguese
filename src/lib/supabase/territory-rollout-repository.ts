import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  TerritoryRollout,
  TerritoryRolloutStage,
  TerritoryRolloutTargetKind,
} from '@/core/territory/domain/rollout';
import type { TerritoryRolloutRepository } from '@/core/territory/ports/territory-rollout-repository';
import type { Database } from '@/lib/supabase/database.types';

type RolloutRow =
  Database['public']['Views']['territory_rollout_catalog']['Row'];

function mapRollout(row: RolloutRow): TerritoryRollout {
  if (
    !row.id ||
    !row.target_kind ||
    !row.target_id ||
    !row.slug ||
    !row.name ||
    !row.stage ||
    !row.updated_at
  ) {
    throw new Error('territory_rollout_incomplete_projection');
  }

  return {
    id: row.id,
    targetKind: row.target_kind as TerritoryRolloutTargetKind,
    targetId: row.target_id,
    slug: row.slug,
    name: row.name,
    geographicPath: row.geographic_path,
    stage: row.stage as TerritoryRolloutStage,
    activatedAt: row.activated_at,
    updatedAt: row.updated_at,
  };
}

export class SupabaseTerritoryRolloutRepository
  implements TerritoryRolloutRepository
{
  constructor(
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async findByTarget(
    targetKind: TerritoryRolloutTargetKind,
    targetId: string,
  ): Promise<TerritoryRollout | null> {
    const { data, error } = await this.supabase
      .from('territory_rollout_catalog')
      .select('*')
      .eq('target_kind', targetKind)
      .eq('target_id', targetId)
      .maybeSingle();

    if (error) throw error;
    return data ? mapRollout(data) : null;
  }

  async findBySlug(
    slug: string,
  ): Promise<TerritoryRollout[]> {
    const { data, error } = await this.supabase
      .from('territory_rollout_catalog')
      .select('*')
      .eq('slug', slug)
      .order('target_kind');

    if (error) throw error;
    return (data ?? []).map(mapRollout);
  }

  async listByStage(
    stage: TerritoryRolloutStage,
  ): Promise<TerritoryRollout[]> {
    const { data, error } = await this.supabase
      .from('territory_rollout_catalog')
      .select('*')
      .eq('stage', stage)
      .order('name');

    if (error) throw error;
    return (data ?? []).map(mapRollout);
  }
}
