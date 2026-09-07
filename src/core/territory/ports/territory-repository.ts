import type {
  Territory,
  TerritoryGroup,
  TerritoryReference,
  TerritoryScope,
} from '@/core/territory/domain/types';

export interface TerritoryRepository {
  findById(id: string): Promise<Territory | null>;
  findByGeographicPath(path: string): Promise<Territory | null>;
  findChildren(parentId: string): Promise<TerritoryReference[]>;
  findGroupBySlug(
    anchorCityId: string,
    slug: string,
  ): Promise<TerritoryGroup | null>;
  findGroupMembers(groupId: string): Promise<TerritoryReference[]>;
  resolveScope(scope: TerritoryScope): Promise<TerritoryReference[]>;
}
