import type {
  PublicPlace,
  PublicPlaceCategory,
  TerritoryDataSource,
  TerritoryFact,
} from '@/data/territory/types';

export interface TerritoryDataRepository {
  listSources(): Promise<TerritoryDataSource[]>;
  listFacts(
    territoryId: string,
    metricKeys?: string[],
  ): Promise<TerritoryFact[]>;
  listPublicPlaceCategories(): Promise<PublicPlaceCategory[]>;
  listPublicPlaces(
    territoryId: string,
    categoryKeys?: string[],
    limit?: number,
  ): Promise<PublicPlace[]>;
}
