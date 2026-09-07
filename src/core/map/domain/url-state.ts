import type { BoundingBox } from '@/core/territory';
import { isValidMapBounds } from './validation.ts';

export type MapUrlState = {
  bounds: BoundingBox;
  zoom: number;
  categories: string[];
};

export type MapUrlParams = Record<
  string,
  string | string[] | undefined
>;

function firstValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseNumber(
  value: string | undefined,
): number | null {
  if (value === undefined) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseCategories(
  value: string | undefined,
  fallback: string[],
): string[] {
  if (value === undefined) return fallback;

  if (value === 'none') return [];

  const categories = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (
    categories.length > 10 ||
    categories.some(
      (item) => !/^[a-z0-9_]{1,64}$/.test(item),
    )
  ) {
    return fallback;
  }

  return [...new Set(categories)];
}

export function parseMapUrlState(
  params: MapUrlParams,
  fallback: MapUrlState,
): MapUrlState {
  const west = parseNumber(firstValue(params.west));
  const south = parseNumber(firstValue(params.south));
  const east = parseNumber(firstValue(params.east));
  const north = parseNumber(firstValue(params.north));
  const zoom = parseNumber(firstValue(params.zoom));

  if (
    west === null ||
    south === null ||
    east === null ||
    north === null ||
    zoom === null
  ) {
    return {
      ...fallback,
      bounds: { ...fallback.bounds },
      categories: [...fallback.categories],
    };
  }

  const bounds = {
    west,
    south,
    east,
    north,
  };

  if (
    !isValidMapBounds(bounds) ||
    zoom < 0 ||
    zoom > 24
  ) {
    return {
      ...fallback,
      bounds: { ...fallback.bounds },
      categories: [...fallback.categories],
    };
  }

  return {
    bounds,
    zoom,
    categories: parseCategories(
      firstValue(params.categories),
      fallback.categories,
    ),
  };
}

function compactNumber(value: number) {
  return String(Number(value.toFixed(6)));
}

export function formatMapUrlState(
  state: MapUrlState,
): Record<string, string> {
  return {
    west: compactNumber(state.bounds.west),
    south: compactNumber(state.bounds.south),
    east: compactNumber(state.bounds.east),
    north: compactNumber(state.bounds.north),
    zoom: String(Number(state.zoom.toFixed(2))),
    categories: state.categories.length
      ? [...new Set(state.categories)].sort().join(',')
      : 'none',
  };
}
