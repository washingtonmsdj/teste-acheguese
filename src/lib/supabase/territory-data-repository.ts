import type { SupabaseClient } from '@supabase/supabase-js';
import type { Json } from '@/lib/supabase/database.types';
import type { Database } from '@/lib/supabase/database.types';
import type { TerritoryDataRepository } from '@/data/territory/territory-data-repository';
import type {
  PublicPlace,
  PublicPlaceCategory,
  TerritoryDataProvenance,
  TerritoryDataSource,
  TerritoryFact,
  TerritoryFactValue,
} from '@/data/territory/types';

type FactRow =
  Database['public']['Views']['territory_fact_catalog']['Row'];
type PlaceRow =
  Database['public']['Views']['public_place_catalog']['Row'];
type SourceRow =
  Database['public']['Tables']['territory_data_sources']['Row'];
type CategoryRow =
  Database['public']['Tables']['public_place_categories']['Row'];

function requireString(
  value: string | null,
  field: string,
): string {
  if (!value) {
    throw new Error(`territory_data_projection_missing:${field}`);
  }

  return value;
}

function mapProvenance(
  row: {
    source_id: string | null;
    source_key: string | null;
    provider_name: string | null;
    dataset_name: string | null;
    source_url: string | null;
    attribution: string | null;
    source_snapshot_id: string | null;
    source_version: string | null;
    fetched_at: string | null;
  },
): TerritoryDataProvenance {
  return {
    sourceId: requireString(row.source_id, 'source_id'),
    sourceKey: requireString(row.source_key, 'source_key'),
    providerName: requireString(row.provider_name, 'provider_name'),
    datasetName: requireString(row.dataset_name, 'dataset_name'),
    sourceUrl: requireString(row.source_url, 'source_url'),
    attribution: row.attribution,
    sourceSnapshotId: requireString(
      row.source_snapshot_id,
      'source_snapshot_id',
    ),
    sourceVersion: row.source_version,
    fetchedAt: requireString(row.fetched_at, 'fetched_at'),
  };
}

function mapDimensions(
  value: Json | null,
): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function mapFactValue(row: FactRow): TerritoryFactValue {
  const values = [
    row.value_numeric !== null,
    row.value_text !== null,
    row.value_boolean !== null,
  ].filter(Boolean).length;

  if (values !== 1) {
    throw new Error('territory_fact_invalid_value_projection');
  }

  if (row.value_numeric !== null) {
    return {
      type: 'numeric',
      value: row.value_numeric,
      unit: row.unit,
    };
  }

  if (row.value_text !== null) {
    return {
      type: 'text',
      value: row.value_text,
      unit: row.unit,
    };
  }

  return {
    type: 'boolean',
    value: row.value_boolean as boolean,
    unit: row.unit,
  };
}

function mapFact(row: FactRow): TerritoryFact {
  return {
    id: requireString(row.id, 'fact.id'),
    territoryId: requireString(row.territory_id, 'fact.territory_id'),
    metricKey: requireString(row.metric_key, 'fact.metric_key'),
    metricLabel: requireString(row.metric_label, 'fact.metric_label'),
    referencePeriod: requireString(
      row.reference_period,
      'fact.reference_period',
    ),
    value: mapFactValue(row),
    dimensions: mapDimensions(row.dimensions),
    sourceRecordId: row.source_record_id,
    provenance: mapProvenance(row),
  };
}

function mapPlace(row: PlaceRow): PublicPlace {
  return {
    id: requireString(row.id, 'place.id'),
    territoryId: requireString(row.territory_id, 'place.territory_id'),
    categoryKey: requireString(row.category_key, 'place.category_key'),
    categoryLabel: requireString(
      row.category_label,
      'place.category_label',
    ),
    name: requireString(row.name, 'place.name'),
    description: row.description,
    latitude: row.latitude,
    longitude: row.longitude,
    addressText: row.address_text,
    neighborhoodLabel: row.neighborhood_label,
    postalCode: row.postal_code,
    phone: row.phone,
    website: row.website,
    externalId: row.external_id,
    provenance: mapProvenance(row),
  };
}

function mapSource(row: SourceRow): TerritoryDataSource {
  return {
    id: row.id,
    key: row.key,
    providerName: row.provider_name,
    datasetName: row.dataset_name,
    sourceUrl: row.source_url,
    licenseName: row.license_name,
    licenseUrl: row.license_url,
    attribution: row.attribution,
  };
}

function mapCategory(row: CategoryRow): PublicPlaceCategory {
  return {
    key: row.key,
    parentKey: row.parent_key,
    label: row.label,
  };
}

export class SupabaseTerritoryDataRepository
  implements TerritoryDataRepository
{
  constructor(
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async listSources(): Promise<TerritoryDataSource[]> {
    const { data, error } = await this.supabase
      .from('territory_data_sources')
      .select('*')
      .order('provider_name')
      .order('dataset_name');

    if (error) throw error;
    return (data ?? []).map(mapSource);
  }

  async listFacts(
    territoryId: string,
    metricKeys?: string[],
  ): Promise<TerritoryFact[]> {
    return this.listFactsForTerritories(
      [territoryId],
      metricKeys,
    );
  }

  async listFactsForTerritories(
    territoryIds: string[],
    metricKeys?: string[],
  ): Promise<TerritoryFact[]> {
    if (!territoryIds.length) return [];

    let query = this.supabase
      .from('territory_fact_catalog')
      .select('*')
      .in('territory_id', [...new Set(territoryIds)])
      .order('territory_id')
      .order('metric_key')
      .order('reference_period', { ascending: false });

    if (metricKeys?.length) {
      query = query.in(
        'metric_key',
        [...new Set(metricKeys)],
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data ?? []).map(mapFact);
  }

  async listPublicPlaceCategories(): Promise<PublicPlaceCategory[]> {
    const { data, error } = await this.supabase
      .from('public_place_categories')
      .select('*')
      .order('sort_order')
      .order('label');

    if (error) throw error;
    return (data ?? []).map(mapCategory);
  }

  async listPublicPlaces(
    territoryId: string,
    categoryKeys?: string[],
    limit = 100,
  ): Promise<PublicPlace[]> {
    return this.listPublicPlacesForTerritories(
      [territoryId],
      categoryKeys,
      limit,
    );
  }

  async listPublicPlacesForTerritories(
    territoryIds: string[],
    categoryKeys?: string[],
    limit = 200,
  ): Promise<PublicPlace[]> {
    if (!territoryIds.length) return [];

    const safeLimit = Math.min(Math.max(limit, 1), 500);

    let query = this.supabase
      .from('public_place_catalog')
      .select('*')
      .in('territory_id', [...new Set(territoryIds)])
      .order('territory_id')
      .order('name')
      .limit(safeLimit);

    if (categoryKeys?.length) {
      query = query.in(
        'category_key',
        [...new Set(categoryKeys)],
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data ?? []).map(mapPlace);
  }
}
