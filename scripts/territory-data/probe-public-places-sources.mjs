import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT =
  'https://services6.arcgis.com/GP5qdNaePRPh2SdT/ArcGIS/rest/services';

const candidates = [
  'Escolas',
  'Unidades_educacao',
  'Unidades_Educacionais_AGOL',
  'Unidades_Saude',
];

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'achegue-se-territory-source-probe/1',
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(
      `arcgis_metadata_fetch_failed:${response.status}:${url}`,
    );
  }

  return response.json();
}

function simplifyField(field) {
  return {
    name: field?.name ?? null,
    alias: field?.alias ?? null,
    type: field?.type ?? null,
    length: field?.length ?? null,
    nullable: field?.nullable ?? null,
  };
}

const services = [];

for (const serviceName of candidates) {
  const serviceUrl =
    `${ROOT}/${encodeURIComponent(serviceName)}/FeatureServer`;
  const service = await fetchJson(`${serviceUrl}?f=json`);

  const layers = [];

  for (const layerRef of service.layers ?? []) {
    const layerUrl = `${serviceUrl}/${layerRef.id}`;
    const layer = await fetchJson(`${layerUrl}?f=json`);

    layers.push({
      id: layerRef.id,
      name: layer.name ?? layerRef.name ?? null,
      url: layerUrl,
      geometryType: layer.geometryType ?? null,
      objectIdField: layer.objectIdField ?? null,
      globalIdField: layer.globalIdField ?? null,
      displayField: layer.displayField ?? null,
      maxRecordCount: layer.maxRecordCount ?? null,
      supportedQueryFormats: layer.supportedQueryFormats ?? null,
      spatialReference:
        layer.extent?.spatialReference?.latestWkid ??
        layer.extent?.spatialReference?.wkid ??
        null,
      lastEditDate: layer.editingInfo?.lastEditDate ?? null,
      dataLastEditDate: layer.editingInfo?.dataLastEditDate ?? null,
      schemaLastEditDate: layer.editingInfo?.schemaLastEditDate ?? null,
      fields: (layer.fields ?? []).map(simplifyField),
    });
  }

  services.push({
    serviceName,
    serviceUrl,
    serviceItemId: service.serviceItemId ?? null,
    serviceDescription: service.serviceDescription ?? null,
    maxRecordCount: service.maxRecordCount ?? null,
    supportedQueryFormats: service.supportedQueryFormats ?? null,
    layers,
  });
}

const manifest = {
  schema: 'acheguese.arcgis-source-metadata-probe/1',
  fetchedAt: new Date().toISOString(),
  provider: 'Prefeitura Municipal de Salvador / GeoSalvador',
  services,
};

const outputDir =
  process.env.TERRITORY_DATA_OUTPUT ??
  'territory-public-places-metadata';

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, 'public-places-source-metadata.json'),
  JSON.stringify(manifest, null, 2) + '\n',
  'utf8',
);

console.log(
  'TERRITORY_SOURCE_METADATA_RESULT=' +
    JSON.stringify(manifest),
);
