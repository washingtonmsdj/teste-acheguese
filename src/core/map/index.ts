export type {
  MapBoundaryFeature,
  MapLayerId,
  MapPointFeature,
  MapSourceReference,
  MapViewport,
  MapViewportData,
  MapViewportQuery,
} from '@/core/map/domain/types';

export {
  isValidMapBounds,
  normalizeMapViewportQuery,
} from '@/core/map/domain/validation';

export type {
  MapDataRepository,
} from '@/core/map/ports/map-data-repository';
