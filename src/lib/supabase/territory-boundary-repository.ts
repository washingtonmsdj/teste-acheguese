import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  GeoJsonMultiPolygon,
  GeoJsonPolygon,
  TerritoryBoundary,
} from '@/core/territory/domain/boundary';
import type { TerritoryBoundaryRepository } from '@/core/territory/ports/territory-boundary-repository';
import type { Database, Json } from '@/lib/supabase/database.types';

type BoundaryRow =
  Database['public']['Views']['territory_boundary_catalog']['Row'];

function isGeoJsonObject(
  value: Json | null,
): value is Exclude<Json, null | string | number | boolean | Json[]> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isMultiPolygon(
  value: Json | null,
): value is GeoJsonMultiPolygon {
  return (
    isGeoJsonObject(value) &&
    value.type === 'MultiPolygon' &&
    Array.isArray(value.coordinates)
  );
}

function isPolygon(
  value: Json | null,
): value is GeoJsonPolygon {
  return (
    isGeoJsonObject(value) &&
    value.type === 'Polygon' &&
    Array.isArray(value.coordinates)
  );
}

function mapBoundary(row: BoundaryRow): TerritoryBoundary {
  if (!isMultiPolygon(row.geojson) || !isPolygon(row.bbox_geojson)) {
    throw new Error('territory_boundary_invalid_geojson');
  }

  if (
    !row.territory_id ||
    !row.slug ||
    !row.name ||
    !row.geographic_path ||
    !row.source_name ||
    row.area_m2 === null ||
    !row.imported_at ||
    !row.updated_at
  ) {
    throw new Error('territory_boundary_incomplete_projection');
  }

  return {
    territoryId: row.territory_id,
    slug: row.slug,
    name: row.name,
    geographicPath: row.geographic_path,
    centerLatitude: row.center_latitude,
    centerLongitude: row.center_longitude,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    sourceObjectId: row.source_object_id,
    geojson: row.geojson,
    bboxGeojson: row.bbox_geojson,
    areaInSquareMeters: row.area_m2,
    importedAt: row.imported_at,
    updatedAt: row.updated_at,
  };
}

export class SupabaseTerritoryBoundaryRepository
  implements TerritoryBoundaryRepository
{
  constructor(
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async findByTerritoryId(
    territoryId: string,
  ): Promise<TerritoryBoundary | null> {
    const { data, error } = await this.supabase
      .from('territory_boundary_catalog')
      .select('*')
      .eq('territory_id', territoryId)
      .maybeSingle();

    if (error) throw error;
    return data ? mapBoundary(data) : null;
  }

  async findByGeographicPath(
    geographicPath: string,
  ): Promise<TerritoryBoundary | null> {
    const { data, error } = await this.supabase
      .from('territory_boundary_catalog')
      .select('*')
      .eq('geographic_path', geographicPath)
      .maybeSingle();

    if (error) throw error;
    return data ? mapBoundary(data) : null;
  }

  async findByTerritoryIds(
    territoryIds: string[],
  ): Promise<TerritoryBoundary[]> {
    if (!territoryIds.length) return [];

    const { data, error } = await this.supabase
      .from('territory_boundary_catalog')
      .select('*')
      .in('territory_id', territoryIds)
      .order('name');

    if (error) throw error;
    return (data ?? []).map(mapBoundary);
  }
}
