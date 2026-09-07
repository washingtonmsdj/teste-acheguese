import type {
  TerritoryRollout,
  TerritoryRolloutTargetKind,
} from '@/core/territory/domain/rollout';

export interface TerritoryRolloutRepository {
  findByTarget(
    targetKind: TerritoryRolloutTargetKind,
    targetId: string,
  ): Promise<TerritoryRollout | null>;

  findBySlug(slug: string): Promise<TerritoryRollout[]>;

  listByStage(
    stage: TerritoryRollout['stage'],
  ): Promise<TerritoryRollout[]>;
}
