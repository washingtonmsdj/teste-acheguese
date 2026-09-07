import {
  buildArcGisQueryUrl,
  readArcGisAttributes,
} from '@/data/sources/arcgis-feature-service';

export const GEOSALVADOR_CENSUS_SOURCE_KEY =
  'geosalvador-censo-2010-2022-bairros';

export const GEOSALVADOR_CENSUS_LAYER_URL =
  'https://services6.arcgis.com/GP5qdNaePRPh2SdT/ArcGIS/rest/services/censo_2010_e_2022_por_bairro/FeatureServer/0';

export const COMPLEXO_CENSUS_TERRITORIES = [
  {
    sourceName: 'Chapada do Rio Vermelho',
    geographicPath: '/br/ba/salvador/chapada-do-rio-vermelho',
  },
  {
    sourceName: 'Nordeste de Amaralina',
    geographicPath: '/br/ba/salvador/nordeste-de-amaralina',
  },
  {
    sourceName: 'Santa Cruz',
    geographicPath: '/br/ba/salvador/santa-cruz',
  },
  {
    sourceName: 'Vale das Pedrinhas',
    geographicPath: '/br/ba/salvador/vale-das-pedrinhas',
  },
] as const;

export const CENSUS_2022_CORE_FIELDS = [
  'FID',
  'NOME_BAIRR',
  'C001',
  'C002',
  'C003',
  'C004',
  'C018',
  'C026',
  'C027',
] as const;

type CensusAttributes = Record<string, unknown> & {
  FID?: unknown;
  NOME_BAIRR?: unknown;
  C001?: unknown;
  C002?: unknown;
  C003?: unknown;
  C004?: unknown;
  C018?: unknown;
  C026?: unknown;
  C027?: unknown;
};

export type Census2022CoreRecord = {
  sourceRecordId: string;
  sourceNeighborhoodName: string;
  geographicPath: string;
  populationTotal: number;
  populationMale: number;
  populationFemale: number;
  populationDensity: number;
  populationLiterate: number;
  householdsTotal: number;
  householdsPermanent: number;
};

const territoryBySourceName = new Map(
  COMPLEXO_CENSUS_TERRITORIES.map((territory) => [
    territory.sourceName,
    territory,
  ]),
);

function readRequiredText(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`census_field_invalid:${field}`);
  }

  return value.trim();
}

function readRequiredNumber(value: unknown, field: string) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`census_field_invalid:${field}`);
  }

  return value;
}

export function buildComplexoCensus2022QueryUrl() {
  const names = COMPLEXO_CENSUS_TERRITORIES
    .map(({ sourceName }) => `'${sourceName.replaceAll("'", "''")}'`)
    .join(',');

  return buildArcGisQueryUrl({
    layerUrl: GEOSALVADOR_CENSUS_LAYER_URL,
    where: `NOME_BAIRR IN (${names})`,
    outFields: [...CENSUS_2022_CORE_FIELDS],
    returnGeometry: false,
  });
}

export function parseComplexoCensus2022Response(
  payload: unknown,
): Census2022CoreRecord[] {
  const attributes = readArcGisAttributes<CensusAttributes>(payload);

  if (attributes.length !== COMPLEXO_CENSUS_TERRITORIES.length) {
    throw new Error(
      `census_record_count_invalid:${attributes.length}`,
    );
  }

  const seen = new Set<string>();

  const records = attributes.map((row) => {
    const neighborhoodName = readRequiredText(
      row.NOME_BAIRR,
      'NOME_BAIRR',
    );

    if (seen.has(neighborhoodName)) {
      throw new Error(
        `census_duplicate_neighborhood:${neighborhoodName}`,
      );
    }

    seen.add(neighborhoodName);

    const territory = territoryBySourceName.get(neighborhoodName);

    if (!territory) {
      throw new Error(
        `census_unexpected_neighborhood:${neighborhoodName}`,
      );
    }

    const fid = readRequiredNumber(row.FID, 'FID');

    return {
      sourceRecordId: String(fid),
      sourceNeighborhoodName: neighborhoodName,
      geographicPath: territory.geographicPath,
      populationTotal: readRequiredNumber(row.C001, 'C001'),
      populationMale: readRequiredNumber(row.C002, 'C002'),
      populationFemale: readRequiredNumber(row.C003, 'C003'),
      populationDensity: readRequiredNumber(row.C004, 'C004'),
      populationLiterate: readRequiredNumber(row.C018, 'C018'),
      householdsTotal: readRequiredNumber(row.C026, 'C026'),
      householdsPermanent: readRequiredNumber(row.C027, 'C027'),
    };
  });

  for (const territory of COMPLEXO_CENSUS_TERRITORIES) {
    if (!seen.has(territory.sourceName)) {
      throw new Error(
        `census_missing_neighborhood:${territory.sourceName}`,
      );
    }
  }

  return records.sort((a, b) =>
    a.geographicPath.localeCompare(b.geographicPath),
  );
}
