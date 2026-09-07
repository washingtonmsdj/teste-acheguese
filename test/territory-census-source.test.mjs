import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildComplexoCensus2022QueryUrl,
  parseComplexoCensus2022Response,
} from '../src/data/sources/geosalvador/census-2010-2022.ts';

const validFeatures = [
  ['Chapada do Rio Vermelho', 13, 20106, 9100, 9099],
  ['Nordeste de Amaralina', 11, 20628, 9045, 9041],
  ['Santa Cruz', 14, 21494, 9917, 9916],
  ['Vale das Pedrinhas', 12, 6129, 2580, 2580],
].map(([name, fid, population, households, permanent]) => ({
  attributes: {
    FID: fid,
    NOME_BAIRR: name,
    C001: population,
    C026: households,
    C027: permanent,
  },
}));

test('monta query ArcGIS somente com campos de semântica validada', () => {
  const url = new URL(buildComplexoCensus2022QueryUrl());

  assert.equal(url.pathname.endsWith('/FeatureServer/0/query'), true);
  assert.equal(url.searchParams.get('f'), 'json');
  assert.equal(url.searchParams.get('returnGeometry'), 'false');

  const fields = url.searchParams.get('outFields')?.split(',') ?? [];
  assert.deepEqual(fields, [
    'FID',
    'NOME_BAIRR',
    'C001',
    'C026',
    'C027',
  ]);
});

test('aceita exatamente os quatro registros esperados', () => {
  const records = parseComplexoCensus2022Response({
    features: validFeatures,
  });

  assert.equal(records.length, 4);
  assert.equal(
    records.find((row) =>
      row.geographicPath.endsWith('/santa-cruz'),
    )?.populationTotal,
    21494,
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

test('bloqueia contagem não inteira', () => {
  const invalid = structuredClone(validFeatures);
  invalid[0].attributes.C001 = 20106.5;

  assert.throws(
    () =>
      parseComplexoCensus2022Response({ features: invalid }),
    /census_field_invalid:C001/,
  );
});

test('bloqueia domicílios permanentes acima do total', () => {
  const invalid = structuredClone(validFeatures);
  invalid[0].attributes.C027 = 9101;

  assert.throws(
    () =>
      parseComplexoCensus2022Response({ features: invalid }),
    /census_permanent_households_exceed_total/,
  );
});
