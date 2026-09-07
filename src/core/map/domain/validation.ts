import type {
  BoundingBox,
} from '@/core/territory';
import type {
  MapViewportQuery,
} from '@/core/map/domain/types';

export const MAP_VIEWPORT_MIN_ZOOM = 10;
export const MAP_VIEWPORT_MAX_SPAN_DEGREES = 2;
export const MAP_MAX_CATEGORY_KEYS = 10;

const MAP_CATEGORY_KEY_PATTERN =
  /^[a-z0-9_]{1,64}$/;

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

export function isSupportedMapViewport(
  bounds: BoundingBox,
  zoom: number,
): boolean {
  return (
    isValidMapBounds(bounds) &&
    Number.isFinite(zoom) &&
    zoom >= MAP_VIEWPORT_MIN_ZOOM &&
    zoom <= 24 &&
    bounds.east - bounds.west <=
      MAP_VIEWPORT_MAX_SPAN_DEGREES &&
    bounds.north - bounds.south <=
      MAP_VIEWPORT_MAX_SPAN_DEGREES
  );
}

function normalizeCategoryKeys(
  categories: string[] | undefined,
): string[] | undefined {
  if (!categories?.length) return undefined;

  if (
    categories.length > MAP_MAX_CATEGORY_KEYS ||
    categories.some(
      (category) =>
        !MAP_CATEGORY_KEY_PATTERN.test(category),
    )
  ) {
    throw new Error('map_categories_invalid');
  }

  return [...new Set(categories)];
}

export function normalizeMapViewportQuery(
  query: MapViewportQuery,
): MapViewportQuery {
  if (!isValidMapBounds(query.bounds)) {
    throw new Error('map_bbox_invalid');
  }

  if (
    !Number.isFinite(query.zoom) ||
    query.zoom < 0 ||
    query.zoom > 24
  ) {
    throw new Error('map_zoom_invalid');
  }

  if (query.zoom < MAP_VIEWPORT_MIN_ZOOM) {
    throw new Error('map_zoom_unsupported');
  }

  if (
    query.bounds.east - query.bounds.west >
      MAP_VIEWPORT_MAX_SPAN_DEGREES ||
    query.bounds.north - query.bounds.south >
      MAP_VIEWPORT_MAX_SPAN_DEGREES
  ) {
    throw new Error('map_bbox_too_large');
  }

  return {
    ...query,
    layers: [...new Set(query.layers)],
    publicPlaceCategories: normalizeCategoryKeys(
      query.publicPlaceCategories,
    ),
    placeLimit: Math.min(
      Math.max(query.placeLimit ?? 200, 1),
      500,
    ),
    boundaryLimit: Math.min(
      Math.max(query.boundaryLimit ?? 100, 1),
      500,
    ),
  };
}
