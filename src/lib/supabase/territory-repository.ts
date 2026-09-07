import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Coordinates,
  Territory,
  TerritoryGroup,
  TerritoryReference,
  TerritoryScope,
  TerritoryStatus,
  TerritoryType,
} from '@/core/territory';
import type { TerritoryRepository } from '@/core/territory';
import type { Database } from '@/lib/supabase/database.types';

type TerritoryRow = Database['public']['Tables']['territories']['Row'];
type TerritoryGroupRow =
  Database['public']['Tables']['territory_groups']['Row'];

function parseCenter(value: unknown): Coordinates | null {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as {
    type?: unknown;
    coordinates?: unknown;
  };

  if (
    candidate.type !== 'Point' ||
    !Array.isArray(candidate.coordinates) ||
    candidate.coordinates.length < 2
  ) {
    return null;
  }

  const [longitude, latitude] = candidate.coordinates;

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number'
  ) {
    return null;
  }

  return { latitude, longitude };
}

function mapTerritory(row: TerritoryRow): Territory {
  return {
    id: row.id,
    type: row.type as TerritoryType,
    parentId: row.parent_id,
    slug: row.slug,
    name: row.name,
    geographicPath: row.geographic_path,
    status: row.status as TerritoryStatus,
    countryCode: row.country_code,
    stateCode: row.state_code,
    ibgeCode: row.ibge_code,
    timezone: row.timezone,
    center: parseCenter(row.center),
    bbox: null,
  };
}

function mapReference(row: TerritoryRow): TerritoryReference {
  return {
    id: row.id,
    type: row.type as TerritoryType,
    slug: row.slug,
    name: row.name,
    geographicPath: row.geographic_path,
    status: row.status as TerritoryStatus,
  };
}

function mapGroup(row: TerritoryGroupRow): TerritoryGroup {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    anchorCityId: row.anchor_city_id,
    status: row.status as TerritoryGroup['status'],
  };
}

export class SupabaseTerritoryRepository
  implements TerritoryRepository
{
  constructor(
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async findById(id: string): Promise<Territory | null> {
    const { data, error } = await this.supabase
      .from('territories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapTerritory(data) : null;
  }

  async findByGeographicPath(
    path: string,
  ): Promise<Territory | null> {
    const { data, error } = await this.supabase
      .from('territories')
      .select('*')
      .eq('geographic_path', path)
      .maybeSingle();

    if (error) throw error;
    return data ? mapTerritory(data) : null;
  }

  async findChildren(
    parentId: string,
  ): Promise<TerritoryReference[]> {
    const { data, error } = await this.supabase
      .from('territories')
      .select('*')
      .eq('parent_id', parentId)
      .order('name');

    if (error) throw error;
    return (data ?? []).map(mapReference);
  }

  async findGroupBySlug(
    anchorCityId: string,
    slug: string,
  ): Promise<TerritoryGroup | null> {
    const { data, error } = await this.supabase
      .from('territory_groups')
      .select('*')
      .eq('anchor_city_id', anchorCityId)
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data ? mapGroup(data) : null;
  }

  async findGroupMembers(
    groupId: string,
  ): Promise<TerritoryReference[]> {
    const { data: memberships, error: membershipError } =
      await this.supabase
        .from('territory_group_members')
        .select('territory_id')
        .eq('group_id', groupId);

    if (membershipError) throw membershipError;

    const ids = (memberships ?? []).map((row) => row.territory_id);

    if (!ids.length) return [];

    const { data, error } = await this.supabase
      .from('territories')
      .select('*')
      .in('id', ids)
      .order('name');

    if (error) throw error;
    return (data ?? []).map(mapReference);
  }

  async resolveScope(
    scope: TerritoryScope,
  ): Promise<TerritoryReference[]> {
    if (scope.kind === 'none') return [];

    if (scope.kind === 'group') {
      return this.findGroupMembers(scope.groupId);
    }

    const territory = await this.findById(scope.territoryId);

    return territory
      ? [{
          id: territory.id,
          type: territory.type,
          slug: territory.slug,
          name: territory.name,
          geographicPath: territory.geographicPath,
          status: territory.status,
        }]
      : [];
  }
}
