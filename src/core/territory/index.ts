export type {
  BoundingBox,
  Coordinates,
  Territory,
  TerritoryGroup,
  TerritoryGroupStatus,
  TerritoryReference,
  TerritoryScope,
  TerritoryStatus,
  TerritoryType,
} from '@/core/territory/domain/types';

export type {
  GeoJsonLinearRing,
  GeoJsonMultiPolygon,
  GeoJsonPolygon,
  GeoJsonPolygonCoordinates,
  GeoJsonPosition,
  TerritoryBoundary,
} from '@/core/territory/domain/boundary';

export type { TerritoryRepository } from '@/core/territory/ports/territory-repository';
export type { TerritoryBoundaryRepository } from '@/core/territory/ports/territory-boundary-repository';
