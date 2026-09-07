import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  GeoJsonMultiPolygon,
  GeoJsonPolygon,
} from '@/core/territory';
import type {
  MapBoundaryFeature,
  MapDataRepository,
  MapPointFeature,
  MapSourceReference,
  MapViewportData,
  MapViewportQuery,
} from '@/core/map';
import {
  normalizeMapViewportQuery,
} from '@/core/map';
import type {
  Database,
  Json,
} from '@/lib/supabase/database.types';

type BoundaryRpcRow =
  Database['public']['Functions']['get_territory_boundaries_in_bbox']['Returns'][number];

type PlaceRpcRow =
  Database['public']['Functions']['get_public_places_in_bbox']['Returns'][number];

function isJsonObject(
  value: Json,
): value is { [key: string]: Json | undefined } {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isMultiPolygon(
  value: Json,
): value is GeoJsonMultiPolygon {
  return (
    isJsonObject(value) &&
    value.type === 'MultiPolygon' &&
    Array.isArray(value.coordinates)
  );
}

function isPolygon(
  value: Json,
): value is GeoJsonPolygon {
  return (
    isJsonObject(value) &&
    value.type === 'Polygon' &&
    Array.isArray(value.coordinates)
  );
}

function boundarySource(
  row: BoundaryRpcRow,
): MapSourceReference {
  return {
    key: 'territory-boundary',
    providerName: row.source_name,
    datasetName: row.source_name,
    sourceUrl: row.source_url ?? '',
    attribution: row.source_name,
  };
}

function placeSource(
  row: PlaceRpcRow,
): MapSourceReference {
  return {
    key: row.source_key,
    providerName: row.provider_name,
    datasetName: row.dataset_name,
    sourceUrl: row.source_url,
    attribution: row.attribution,
  };
}

function mapBoundary(
  row: BoundaryRpcRow,
): MapBoundaryFeature {
  if (
    !isMultiPolygon(row.geojson) ||
    !isPolygon(row.bbox_geojson)
  ) {
    throw new Error('map_boundary_geojson_invalid');
  }

  return {
    id: row.territory_id,
    territoryId: row.territory_id,
    territorySlug: row.slug,
    territoryName: row.name,
    geographicPath: row.geographic_path,
    geometry: row.geojson,
    bboxGeometry: row.bbox_geojson,
    areaInSquareMeters: row.area_m2,
    source: boundarySource(row),
  };
}

function mapPoint(
  row: PlaceRpcRow,
): MapPointFeature {
  if (
    !Number.isFinite(row.latitude) ||
    !Number.isFinite(row.longitude)
  ) {
    throw new Error('map_point_coordinates_invalid');
  }

  return {
    id: row.id,
    territoryId: row.territory_id,
    territorySlug: row.territory_slug,
    territoryName: row.territory_name,
    geographicPath: row.geographic_path,
    kind: row.category_key,
    kindLabel: row.category_label,
    coordinates: {
      latitude: row.latitude,
      longitude: row.longitude,
    },
    title: row.name,
    description: row.description,
    address: row.address_text,
    phone: row.phone,
    website: row.website,
    source: placeSource(row),
  };
}

export class SupabaseMapDataRepository
  implements MapDataRepository
{
  constructor(
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async loadViewport(
    rawQuery: MapViewportQuery,
  ): Promise<MapViewportData> {
    const query = normalizeMapViewportQuery(rawQuery);
    const { west, south, east, north } = query.bounds;

    const wantsBoundaries =
      query.layers.includes('boundaries');
    const wantsPlaces =
      query.layers.includes('public_places');

    const [boundaryResult, placeResult] = await Promise.all([
      wantsBoundaries
        ? this.supabase.rpc(
            'get_territory_boundaries_in_bbox',
            {
              p_west: west,
              p_south: south,
              p_east: east,
              p_north: north,
              p_limit: query.boundaryLimit,
            },
          )
        : Promise.resolve({ data: [], error: null }),
      wantsPlaces
        ? this.supabase.rpc(
            'get_public_places_in_bbox',
            {
              p_west: west,
              p_south: south,
              p_east: east,
              p_north: north,
              p_limit: query.placeLimit,
              p_category_keys:
                query.publicPlaceCategories ?? null,
            },
          )
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (boundaryResult.error) {
      throw boundaryResult.error;
    }

    if (placeResult.error) {
      throw placeResult.error;
    }

    return {
      bounds: query.bounds,
      boundaries: (boundaryResult.data ?? []).map(mapBoundary),
      points: (placeResult.data ?? []).map(mapPoint),
    };
  }
}
