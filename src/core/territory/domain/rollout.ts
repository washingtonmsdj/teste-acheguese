export type TerritoryRolloutStage =
  | 'data_preparation'
  | 'internal_preview'
  | 'public_preview'
  | 'launched'
  | 'paused';

export type TerritoryRolloutTargetKind =
  | 'territory'
  | 'group';

export type TerritoryRollout = {
  id: string;
  targetKind: TerritoryRolloutTargetKind;
  targetId: string;
  slug: string;
  name: string;
  geographicPath: string | null;
  stage: TerritoryRolloutStage;
  activatedAt: string | null;
  updatedAt: string;
};

export function isPublicTerritoryStage(
  stage: TerritoryRolloutStage,
) {
  return stage === 'public_preview' || stage === 'launched';
}
