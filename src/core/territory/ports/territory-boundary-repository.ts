import type { TerritoryBoundary } from '@/core/territory/domain/boundary';

export interface TerritoryBoundaryRepository {
  findByTerritoryId(
    territoryId: string,
  ): Promise<TerritoryBoundary | null>;

  findByGeographicPath(
    geographicPath: string,
  ): Promise<TerritoryBoundary | null>;

  findByTerritoryIds(
    territoryIds: string[],
  ): Promise<TerritoryBoundary[]>;
}
