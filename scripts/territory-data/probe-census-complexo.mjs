import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  GEOSALVADOR_CENSUS_SOURCE_KEY,
  buildComplexoCensus2022QueryUrl,
  parseComplexoCensus2022Response,
} from '../../src/data/sources/geosalvador/census-2010-2022.ts';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

const outputDir =
  process.env.TERRITORY_DATA_OUTPUT ?? 'territory-data-output';
const queryUrl = buildComplexoCensus2022QueryUrl();

const response = await fetch(queryUrl, {
  headers: {
    accept: 'application/json',
    'user-agent': 'achegue-se-territory-data-probe/1',
  },
  signal: AbortSignal.timeout(30_000),
});

if (!response.ok) {
  throw new Error(
    `census_fetch_failed:${response.status}:${response.statusText}`,
  );
}

const rawText = await response.text();
const payload = JSON.parse(rawText);
const records = parseComplexoCensus2022Response(payload);
const normalizedText = JSON.stringify(records, null, 2) + '\n';

const manifest = {
  schema: 'acheguese.territory-data-probe/1',
  sourceKey: GEOSALVADOR_CENSUS_SOURCE_KEY,
  queryUrl,
  fetchedAt: new Date().toISOString(),
  recordCount: records.length,
  rawSha256: sha256(rawText),
  normalizedSha256: sha256(normalizedText),
  records,
};

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, 'census-complexo-raw.json'),
  rawText.endsWith('\n') ? rawText : rawText + '\n',
  'utf8',
);
await writeFile(
  path.join(outputDir, 'census-complexo-normalized.json'),
  normalizedText,
  'utf8',
);
await writeFile(
  path.join(outputDir, 'census-complexo-manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
  'utf8',
);

console.log('TERRITORY_DATA_PROBE_RESULT=' + JSON.stringify(manifest));
