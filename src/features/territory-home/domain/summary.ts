import type {
  PublicPlace,
  TerritoryFact,
} from '@/data/territory/types';
import type {
  TerritoryHomeMetric,
  TerritoryHomeSource,
} from '@/features/territory-home/types';

function latestNumericFact(
  territoryId: string,
  metricKey: string,
  facts: TerritoryFact[],
): TerritoryFact | null {
  const candidates = facts
    .filter(
      (fact) =>
        fact.territoryId === territoryId &&
        fact.metricKey === metricKey &&
        fact.value.type === 'numeric',
    )
    .sort((a, b) =>
      b.referencePeriod.localeCompare(a.referencePeriod),
    );

  return candidates[0] ?? null;
}

export function aggregateNumericMetric(
  territoryIds: string[],
  metricKey: string,
  facts: TerritoryFact[],
): TerritoryHomeMetric {
  if (!territoryIds.length) {
    return {
      value: null,
      referencePeriod: null,
    };
  }

  const selected = territoryIds.map((territoryId) =>
    latestNumericFact(territoryId, metricKey, facts),
  );

  if (selected.some((fact) => !fact)) {
    return {
      value: null,
      referencePeriod: null,
    };
  }

  const complete = selected as TerritoryFact[];

  if (
    complete.some(
      (fact) => fact.value.type !== 'numeric',
    )
  ) {
    return {
      value: null,
      referencePeriod: null,
    };
  }

  const periods = [
    ...new Set(
      complete.map((fact) => fact.referencePeriod),
    ),
  ];

  return {
    value: complete.reduce(
      (total, fact) =>
        total +
        (fact.value.type === 'numeric'
          ? fact.value.value
          : 0),
      0,
    ),
    referencePeriod:
      periods.length === 1 ? periods[0] : null,
  };
}

export function countPlaces(
  territoryIds: string[],
  places: PublicPlace[],
  categoryKey?: string,
): number {
  const allowed = new Set(territoryIds);

  return places.filter(
    (place) =>
      allowed.has(place.territoryId) &&
      (!categoryKey ||
        place.categoryKey === categoryKey),
  ).length;
}

function safeHttpUrl(value: string): string | null {
  try {
    const url = new URL(value);

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function collectSources(
  territoryIds: string[],
  facts: TerritoryFact[],
  places: PublicPlace[],
): TerritoryHomeSource[] {
  const allowed = new Set(territoryIds);
  const result = new Map<string, TerritoryHomeSource>();

  const provenanceItems = [
    ...facts
      .filter((fact) => allowed.has(fact.territoryId))
      .map((fact) => fact.provenance),
    ...places
      .filter((place) => allowed.has(place.territoryId))
      .map((place) => place.provenance),
  ];

  for (const source of provenanceItems) {
    const key =
      `${source.providerName}::${source.datasetName}`;

    if (result.has(key)) continue;

    result.set(key, {
      providerName: source.providerName,
      datasetName: source.datasetName,
      sourceUrl: safeHttpUrl(source.sourceUrl),
    });
  }

  return [...result.values()].sort((a, b) =>
    a.providerName.localeCompare(
      b.providerName,
      'pt-BR',
    ),
  );
}
