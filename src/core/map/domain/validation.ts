import type {
  BoundingBox,
} from '@/core/territory';
import type {
  MapViewportQuery,
} from '@/core/map/domain/types';

export function isValidMapBounds(
  bounds: BoundingBox,
): boolean {
  return (
    Number.isFinite(bounds.west) &&
    Number.isFinite(bounds.south) &&
    Number.isFinite(bounds.east) &&
    Number.isFinite(bounds.north) &&
    bounds.west >= -180 &&
    bounds.east <= 180 &&
    bounds.south >= -90 &&
    bounds.north <= 90 &&
    bounds.west < bounds.east &&
    bounds.south < bounds.north
  );
}

export function normalizeMapViewportQuery(
  query: MapViewportQuery,
): MapViewportQuery {
  if (!isValidMapBounds(query.bounds)) {
    throw new Error('map_bbox_invalid');
  }

  if (!Number.isFinite(query.zoom) || query.zoom < 0 || query.zoom > 24) {
    throw new Error('map_zoom_invalid');
  }

  return {
    ...query,
    layers: [...new Set(query.layers)],
    publicPlaceCategories: query.publicPlaceCategories?.length
      ? [...new Set(query.publicPlaceCategories)]
      : undefined,
    placeLimit: Math.min(Math.max(query.placeLimit ?? 200, 1), 500),
    boundaryLimit: Math.min(
      Math.max(query.boundaryLimit ?? 100, 1),
      500,
    ),
  };
}
