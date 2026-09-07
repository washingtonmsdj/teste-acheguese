import type {
  BoundingBox,
  TerritoryBoundary,
  TerritoryReference,
} from '@/core/territory';
import {
  aggregateNumericMetric,
  collectSources,
  countPlaces,
} from '@/features/territory-home/domain/summary';
import type {
  TerritoryHomeData,
  TerritoryHomeNeighborhood,
} from '@/features/territory-home/types';
import { SupabaseMapDataRepository } from '@/lib/supabase/map-data-repository';
import type { Database } from '@/lib/supabase/database.types';
import { SupabaseTerritoryBoundaryRepository } from '@/lib/supabase/territory-boundary-repository';
import { SupabaseTerritoryDataRepository } from '@/lib/supabase/territory-data-repository';
import { SupabaseTerritoryRepository } from '@/lib/supabase/territory-repository';
import { SupabaseTerritoryRolloutRepository } from '@/lib/supabase/territory-rollout-repository';
import type { SupabaseClient } from '@supabase/supabase-js';

const SALVADOR_PATH = '/br/ba/salvador';
const COMPLEXO_SLUG =
  'complexo-do-nordeste-de-amaralina';

function combineBoundaryBounds(
  boundaries: TerritoryBoundary[],
): BoundingBox {
  if (!boundaries.length) {
    throw new Error('territory_home_boundary_missing');
  }

  let west = Number.POSITIVE_INFINITY;
  let south = Number.POSITIVE_INFINITY;
  let east = Number.NEGATIVE_INFINITY;
  let north = Number.NEGATIVE_INFINITY;

  for (const boundary of boundaries) {
    for (const ring of boundary.bboxGeojson.coordinates) {
      for (const [longitude, latitude] of ring) {
        west = Math.min(west, longitude);
        south = Math.min(south, latitude);
        east = Math.max(east, longitude);
        north = Math.max(north, latitude);
      }
    }
  }

  if (
    !Number.isFinite(west) ||
    !Number.isFinite(south) ||
    !Number.isFinite(east) ||
    !Number.isFinite(north)
  ) {
    throw new Error('territory_home_bounds_invalid');
  }

  return {
    west,
    south,
    east,
    north,
  };
}

function buildNeighborhood(
  member: TerritoryReference,
  selectedId: string | null,
  facts: Awaited<
    ReturnType<
      SupabaseTerritoryDataRepository['listFactsForTerritories']
    >
  >,
  places: Awaited<
    ReturnType<
      SupabaseTerritoryDataRepository['listPublicPlacesForTerritories']
    >
  >,
): TerritoryHomeNeighborhood {
  const ids = [member.id];

  return {
    id: member.id,
    slug: member.slug,
    name: member.name,
    selected: member.id === selectedId,
    population: aggregateNumericMetric(
      ids,
      'population_total',
      facts,
    ),
    households: aggregateNumericMetric(
      ids,
      'households_total',
      facts,
    ),
    educationCount: countPlaces(
      ids,
      places,
      'education',
    ),
    healthCount: countPlaces(
      ids,
      places,
      'health',
    ),
    publicPlaceCount: countPlaces(ids, places),
  };
}

export async function loadTerritoryHomeData(
  supabase: SupabaseClient<Database>,
  requestedNeighborhoodSlug?: string,
): Promise<TerritoryHomeData> {
  const territoryRepository =
    new SupabaseTerritoryRepository(supabase);
  const dataRepository =
    new SupabaseTerritoryDataRepository(supabase);
  const boundaryRepository =
    new SupabaseTerritoryBoundaryRepository(supabase);
  const rolloutRepository =
    new SupabaseTerritoryRolloutRepository(supabase);
  const mapRepository =
    new SupabaseMapDataRepository(supabase);

  const city =
    await territoryRepository.findByGeographicPath(
      SALVADOR_PATH,
    );

  if (!city) {
    throw new Error('territory_home_city_missing');
  }

  const group =
    await territoryRepository.findGroupBySlug(
      city.id,
      COMPLEXO_SLUG,
    );

  if (!group) {
    throw new Error('territory_home_group_missing');
  }

  const members =
    await territoryRepository.findGroupMembers(group.id);

  if (!members.length) {
    throw new Error('territory_home_members_missing');
  }

  const selectedMember =
    requestedNeighborhoodSlug
      ? members.find(
          (member) =>
            member.slug === requestedNeighborhoodSlug,
        ) ?? null
      : null;

  const allMemberIds = members.map((member) => member.id);
  const scopeIds = selectedMember
    ? [selectedMember.id]
    : allMemberIds;

  const [
    facts,
    places,
    boundaries,
    rollout,
  ] = await Promise.all([
    dataRepository.listFactsForTerritories(
      allMemberIds,
      [
        'population_total',
        'households_total',
      ],
    ),
    dataRepository.listPublicPlacesForTerritories(
      allMemberIds,
      ['education', 'health'],
      200,
    ),
    boundaryRepository.findByTerritoryIds(allMemberIds),
    selectedMember
      ? rolloutRepository.findByTarget(
          'territory',
          selectedMember.id,
        )
      : rolloutRepository.findByTarget(
          'group',
          group.id,
        ),
  ]);

  if (!rollout) {
    throw new Error('territory_home_rollout_missing');
  }

  const scopeBoundaryIds = new Set(scopeIds);
  const scopeBoundaries = boundaries.filter((boundary) =>
    scopeBoundaryIds.has(boundary.territoryId),
  );
  const bounds = combineBoundaryBounds(scopeBoundaries);

  const rawMapData = await mapRepository.loadViewport({
    bounds,
    zoom: selectedMember ? 15 : 14,
    layers: ['boundaries', 'public_places'],
    publicPlaceCategories: ['education', 'health'],
    placeLimit: 200,
    boundaryLimit: 100,
  });

  const scopeIdSet = new Set(scopeIds);
  const mapData = {
    ...rawMapData,
    boundaries: rawMapData.boundaries.filter(
      (boundary) =>
        scopeIdSet.has(boundary.territoryId),
    ),
    points: rawMapData.points.filter((point) =>
      scopeIdSet.has(point.territoryId),
    ),
  };

  const neighborhoods = members.map((member) =>
    buildNeighborhood(
      member,
      selectedMember?.id ?? null,
      facts,
      places,
    ),
  );

  return {
    scope: {
      kind: selectedMember ? 'territory' : 'group',
      slug: selectedMember?.slug ?? group.slug,
      name: selectedMember?.name ?? group.name,
      rolloutStage: rollout.stage,
      memberCount: selectedMember ? 1 : members.length,
      population: aggregateNumericMetric(
        scopeIds,
        'population_total',
        facts,
      ),
      households: aggregateNumericMetric(
        scopeIds,
        'households_total',
        facts,
      ),
      educationCount: countPlaces(
        scopeIds,
        places,
        'education',
      ),
      healthCount: countPlaces(
        scopeIds,
        places,
        'health',
      ),
      publicPlaceCount: countPlaces(scopeIds, places),
    },
    neighborhoods,
    sources: collectSources(
      scopeIds,
      facts,
      places,
    ),
    mapData,
  };
}
