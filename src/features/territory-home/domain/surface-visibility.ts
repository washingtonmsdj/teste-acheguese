import {
  isPublicTerritoryStage,
  type TerritoryRolloutStage,
} from '../../../core/territory/domain/rollout.ts';

export type TerritorySurfaceVisibility = {
  stage: TerritoryRolloutStage | null;
  isPublic: boolean;
};

export const HIDDEN_TERRITORY_SURFACE: TerritorySurfaceVisibility = {
  stage: null,
  isPublic: false,
};

export function resolveTerritorySurfaceVisibility(
  stage: TerritoryRolloutStage | null,
): TerritorySurfaceVisibility {
  if (!stage) {
    return HIDDEN_TERRITORY_SURFACE;
  }

  return {
    stage,
    isPublic: isPublicTerritoryStage(stage),
  };
}
