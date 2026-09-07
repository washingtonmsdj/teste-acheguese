import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SOURCE_KEY =
  'geosalvador-unidades-educacionais-agol';
const LAYER_URL =
  'https://services6.arcgis.com/GP5qdNaePRPh2SdT/ArcGIS/rest/services/Unidades_Educacionais_AGOL/FeatureServer/0';

const territories = new Map([
  ['chapada do rio vermelho', '/br/ba/salvador/chapada-do-rio-vermelho'],
  ['nordeste de amaralina', '/br/ba/salvador/nordeste-de-amaralina'],
  ['santa cruz', '/br/ba/salvador/santa-cruz'],
  ['vale das pedrinhas', '/br/ba/salvador/vale-das-pedrinhas'],
]);

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function requiredText(value, field, id) {
  const text = String(value ?? '').trim();
  if (!text) {
    throw new Error(`education_field_missing:${field}:${id}`);
  }
  return text;
}

function optionalText(value) {
  const text = String(value ?? '').trim();
  return text || null;
}

function requiredNumber(value, field, id) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`education_field_invalid:${field}:${id}`);
  }
  return value;
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

const response = await fetch(url, {
  headers: {
    accept: 'application/json',
    'user-agent': 'achegue-se-territory-data-probe/1',
  },
  signal: AbortSignal.timeout(30_000),
});

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

for (const feature of payload.features) {
  const attributes = feature?.attributes ?? {};
  const sourceNeighborhood = optionalText(attributes.bairro);
  const geographicPath = territories.get(normalize(sourceNeighborhood));

  if (!geographicPath) {
    continue;
  }

  const fid = requiredNumber(attributes.fid, 'fid', 'unknown');
  const inep = requiredNumber(attributes.cod_inep, 'cod_inep', fid);
  const name = requiredText(attributes.escola, 'escola', fid);
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

  records.push({
    sourceRecordId: String(fid),
    externalId: `inep:${Math.trunc(inep)}`,
    inepCode: Math.trunc(inep),
    name,
    geographicPath,
    sourceNeighborhood,
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

const normalizedText = JSON.stringify(records, null, 2) + '\n';
const manifest = {
  schema: 'acheguese.public-places-probe/1',
  sourceKey: SOURCE_KEY,
  layerUrl: LAYER_URL,
  queryUrl: url.toString(),
  fetchedAt: new Date().toISOString(),
  totalSourceFeatures: payload.features.length,
  recordCount: records.length,
  rawSha256: sha256(rawText),
  normalizedSha256: sha256(normalizedText),
  countsByTerritory: Object.fromEntries(
    [...territories.values()].map((geographicPath) => [
      geographicPath,
      records.filter(
        (record) => record.geographicPath === geographicPath,
      ).length,
    ]),
  ),
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
