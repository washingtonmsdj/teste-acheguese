import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SOURCE_KEY =
  'geosalvador-unidades-educacionais-agol';
const LAYER_URL =
  'https://services6.arcgis.com/GP5qdNaePRPh2SdT/ArcGIS/rest/services/Unidades_Educacionais_AGOL/FeatureServer/0';
const BOUNDARY_MIGRATION =
  'supabase/migrations/20260907073139_territory_complexo_boundaries_v1.sql';

const MVP_PATHS = new Set([
  '/br/ba/salvador/chapada-do-rio-vermelho',
  '/br/ba/salvador/nordeste-de-amaralina',
  '/br/ba/salvador/santa-cruz',
  '/br/ba/salvador/vale-das-pedrinhas',
]);

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function optionalText(value) {
  const text = String(value ?? '').trim();
  return text || null;
}

function requiredText(value, field, id) {
  const text = optionalText(value);
  if (!text) {
    throw new Error(`education_field_missing:${field}:${id}`);
  }
  return text;
}

function requiredNumber(value, field, id) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`education_field_invalid:${field}:${id}`);
  }
  return value;
}

function pointOnSegment(point, start, end) {
  const [px, py] = point;
  const [ax, ay] = start;
  const [bx, by] = end;

  const cross = (px - ax) * (by - ay) - (py - ay) * (bx - ax);
  if (Math.abs(cross) > 1e-12) return false;

  return (
    px >= Math.min(ax, bx) - 1e-12 &&
    px <= Math.max(ax, bx) + 1e-12 &&
    py >= Math.min(ay, by) - 1e-12 &&
    py <= Math.max(ay, by) + 1e-12
  );
}

function pointInRing(point, ring) {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const current = ring[i];
    const previous = ring[j];

    if (
      pointOnSegment(point, previous, current)
    ) {
      return true;
    }

    const [x, y] = point;
    const [xi, yi] = current;
    const [xj, yj] = previous;

    const intersects =
      yi > y !== yj > y &&
      x <
        ((xj - xi) * (y - yi)) / (yj - yi) +
          xi;

    if (intersects) inside = !inside;
  }

  return inside;
}

function pointInPolygon(point, polygon) {
  const [outer, ...holes] = polygon;

  if (!pointInRing(point, outer)) return false;

  return !holes.some((hole) => pointInRing(point, hole));
}

function pointInGeometry(point, geometry) {
  if (geometry.type === 'Polygon') {
    return pointInPolygon(point, geometry.coordinates);
  }

  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.some((polygon) =>
      pointInPolygon(point, polygon),
    );
  }

  throw new Error(
    `unsupported_boundary_geometry:${geometry.type ?? 'unknown'}`,
  );
}

async function loadBoundaries() {
  const sql = await readFile(BOUNDARY_MIGRATION, 'utf8');
  const rowPattern =
    /\('([^']+)',\s*'([^']+)',\s*'(\{.*?\})'::jsonb\)/gs;

  const boundaries = [];

  for (const match of sql.matchAll(rowPattern)) {
    const geographicPath = match[1];

    if (!MVP_PATHS.has(geographicPath)) {
      continue;
    }

    boundaries.push({
      geographicPath,
      sourceObjectId: match[2],
      geometry: JSON.parse(match[3]),
    });
  }

  if (boundaries.length !== 4) {
    throw new Error(
      `education_boundary_count_invalid:${boundaries.length}`,
    );
  }

  return boundaries;
}

const url = new URL(`${LAYER_URL}/query`);
url.searchParams.set('f', 'json');
url.searchParams.set('where', '1=1');
url.searchParams.set(
  'outFields',
  [
    'fid',
    'cod_inep',
    'escola',
    'telefone',
    'tel_secun',
    'email',
    'cep',
    'bairro',
    'logradouro',
    'numero',
  ].join(','),
);
url.searchParams.set('returnGeometry', 'true');
url.searchParams.set('outSR', '4326');
url.searchParams.set('orderByFields', 'fid ASC');

const [boundaries, response] = await Promise.all([
  loadBoundaries(),
  fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'achegue-se-territory-data-probe/1',
    },
    signal: AbortSignal.timeout(30_000),
  }),
]);

if (!response.ok) {
  throw new Error(
    `education_fetch_failed:${response.status}:${response.statusText}`,
  );
}

const rawText = await response.text();
const payload = JSON.parse(rawText);

if (payload.error) {
  throw new Error(
    `education_arcgis_error:${payload.error.code ?? 'unknown'}:${payload.error.message ?? 'unknown'}`,
  );
}

if (!Array.isArray(payload.features)) {
  throw new Error('education_features_missing');
}

if (payload.exceededTransferLimit === true) {
  throw new Error('education_probe_requires_pagination');
}

const records = [];
let outsideMvp = 0;

for (const feature of payload.features) {
  const attributes = feature?.attributes ?? {};
  const fid = requiredNumber(attributes.fid, 'fid', 'unknown');
  const longitude = requiredNumber(
    feature?.geometry?.x,
    'longitude',
    fid,
  );
  const latitude = requiredNumber(
    feature?.geometry?.y,
    'latitude',
    fid,
  );

  if (
    longitude < -180 ||
    longitude > 180 ||
    latitude < -90 ||
    latitude > 90
  ) {
    throw new Error(`education_coordinates_out_of_range:${fid}`);
  }

  const matches = boundaries.filter((boundary) =>
    pointInGeometry(
      [longitude, latitude],
      boundary.geometry,
    ),
  );

  if (!matches.length) {
    outsideMvp += 1;
    continue;
  }

  if (matches.length !== 1) {
    throw new Error(
      `education_boundary_overlap:${fid}:${matches.length}`,
    );
  }

  const inep = requiredNumber(attributes.cod_inep, 'cod_inep', fid);
  const name = requiredText(attributes.escola, 'escola', fid);
  const sourceNeighborhood = optionalText(attributes.bairro);

  records.push({
    sourceRecordId: String(fid),
    externalId: `inep:${Math.trunc(inep)}`,
    inepCode: Math.trunc(inep),
    name,
    geographicPath: matches[0].geographicPath,
    sourceNeighborhood,
    sourceNeighborhoodMatchesGeometry:
      sourceNeighborhood !== null &&
      sourceNeighborhood
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ') ===
        matches[0].geographicPath
          .split('/')
          .at(-1)
          .replaceAll('-', ' '),
    longitude,
    latitude,
    address: {
      street: optionalText(attributes.logradouro),
      number: optionalText(attributes.numero),
      postalCode:
        attributes.cep === null || attributes.cep === undefined
          ? null
          : String(attributes.cep),
    },
    phone: optionalText(attributes.telefone),
    secondaryPhone: optionalText(attributes.tel_secun),
    email: optionalText(attributes.email),
  });
}

records.sort((a, b) =>
  a.externalId.localeCompare(b.externalId),
);

if (!records.length) {
  throw new Error('education_no_records_in_mvp_territories');
}

const externalIds = new Set(records.map((record) => record.externalId));
if (externalIds.size !== records.length) {
  throw new Error('education_duplicate_inep_code');
}

const countsByTerritory = Object.fromEntries(
  [...MVP_PATHS].map((geographicPath) => [
    geographicPath,
    records.filter(
      (record) => record.geographicPath === geographicPath,
    ).length,
  ]),
);

const normalizedText = JSON.stringify(records, null, 2) + '\n';
const manifest = {
  schema: 'acheguese.public-places-probe/2',
  territoryResolution: 'point-in-versioned-boundary',
  boundaryMigration: BOUNDARY_MIGRATION,
  sourceKey: SOURCE_KEY,
  layerUrl: LAYER_URL,
  queryUrl: url.toString(),
  fetchedAt: new Date().toISOString(),
  totalSourceFeatures: payload.features.length,
  outsideMvp,
  recordCount: records.length,
  rawSha256: sha256(rawText),
  normalizedSha256: sha256(normalizedText),
  countsByTerritory,
  sourceLabelMismatchCount: records.filter(
    (record) => !record.sourceNeighborhoodMatchesGeometry,
  ).length,
  records,
};

const outputDir =
  process.env.TERRITORY_DATA_OUTPUT ??
  'territory-education-output';

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, 'education-complexo-raw.json'),
  rawText.endsWith('\n') ? rawText : rawText + '\n',
  'utf8',
);
await writeFile(
  path.join(outputDir, 'education-complexo-normalized.json'),
  normalizedText,
  'utf8',
);
await writeFile(
  path.join(outputDir, 'education-complexo-manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
  'utf8',
);

console.log(
  'TERRITORY_EDUCATION_PROBE_RESULT=' +
    JSON.stringify(manifest),
);
