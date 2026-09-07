import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildComplexoCensus2022QueryUrl,
  parseComplexoCensus2022Response,
} from '../src/data/sources/geosalvador/census-2010-2022.ts';

const validFeatures = [
  ['Chapada do Rio Vermelho', 54],
  ['Nordeste de Amaralina', 112],
  ['Santa Cruz', 142],
  ['Vale das Pedrinhas', 163],
].map(([name, fid], index) => ({
  attributes: {
    FID: fid,
    NOME_BAIRR: name,
    C001: 1000 + index,
    C002: 490 + index,
    C003: 510 + index,
    C004: 100 + index,
    C018: 800 + index,
    C026: 400 + index,
    C027: 390 + index,
  },
}));

test('monta query ArcGIS somente para os quatro bairros e campos permitidos', () => {
  const url = new URL(buildComplexoCensus2022QueryUrl());

  assert.equal(url.pathname.endsWith('/FeatureServer/0/query'), true);
  assert.equal(url.searchParams.get('f'), 'json');
  assert.equal(url.searchParams.get('returnGeometry'), 'false');

  const fields = url.searchParams.get('outFields')?.split(',') ?? [];
  assert.deepEqual(fields, [
    'FID',
    'NOME_BAIRR',
    'C001',
    'C002',
    'C003',
    'C004',
    'C018',
    'C026',
    'C027',
  ]);

  const where = url.searchParams.get('where') ?? '';
  assert.match(where, /Nordeste de Amaralina/);
  assert.match(where, /Santa Cruz/);
  assert.match(where, /Vale das Pedrinhas/);
  assert.match(where, /Chapada do Rio Vermelho/);
});

test('aceita exatamente os quatro registros esperados', () => {
  const records = parseComplexoCensus2022Response({
    features: validFeatures,
  });

  assert.equal(records.length, 4);
  assert.equal(
    records.find((row) =>
      row.geographicPath.endsWith('/santa-cruz'),
    )?.sourceRecordId,
    '142',
  );
});

test('bloqueia dataset incompleto', () => {
  assert.throws(
    () =>
      parseComplexoCensus2022Response({
        features: validFeatures.slice(0, 3),
      }),
    /census_record_count_invalid:3/,
  );
});

test('bloqueia bairro inesperado', () => {
  const invalid = structuredClone(validFeatures);
  invalid[0].attributes.NOME_BAIRR = 'Bairro não autorizado';

  assert.throws(
    () =>
      parseComplexoCensus2022Response({ features: invalid }),
    /census_unexpected_neighborhood/,
  );
});

test('bloqueia campo numérico ausente ou inválido', () => {
  const invalid = structuredClone(validFeatures);
  invalid[0].attributes.C001 = null;

  assert.throws(
    () =>
      parseComplexoCensus2022Response({ features: invalid }),
    /census_field_invalid:C001/,
  );
});
