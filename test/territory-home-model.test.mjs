import assert from 'node:assert/strict';
import test from 'node:test';
import {
  aggregateNumericMetric,
  collectSources,
  countPlaces,
} from '../src/features/territory-home/domain/summary.ts';

const provenance = {
  sourceId: 'source-1',
  sourceKey: 'census',
  providerName: 'Fonte oficial',
  datasetName: 'Censo',
  sourceUrl: 'https://example.gov/dataset',
  attribution: null,
  sourceSnapshotId: 'snapshot-1',
  sourceVersion: '2022',
  fetchedAt: '2026-09-07T00:00:00Z',
};

const facts = [
  {
    id: 'fact-a',
    territoryId: 'a',
    metricKey: 'population_total',
    metricLabel: 'População total',
    referencePeriod: '2022',
    value: { type: 'numeric', value: 100, unit: 'people' },
    dimensions: {},
    sourceRecordId: null,
    provenance,
  },
  {
    id: 'fact-b',
    territoryId: 'b',
    metricKey: 'population_total',
    metricLabel: 'População total',
    referencePeriod: '2022',
    value: { type: 'numeric', value: 250, unit: 'people' },
    dimensions: {},
    sourceRecordId: null,
    provenance,
  },
];

const places = [
  {
    id: 'school-a',
    territoryId: 'a',
    categoryKey: 'education',
    categoryLabel: 'Educação',
    name: 'Escola A',
    description: null,
    latitude: -13,
    longitude: -38,
    addressText: null,
    neighborhoodLabel: null,
    postalCode: null,
    phone: null,
    website: null,
    externalId: null,
    provenance,
  },
  {
    id: 'health-b',
    territoryId: 'b',
    categoryKey: 'health',
    categoryLabel: 'Saúde',
    name: 'Unidade B',
    description: null,
    latitude: -13,
    longitude: -38,
    addressText: null,
    neighborhoodLabel: null,
    postalCode: null,
    phone: null,
    website: null,
    externalId: null,
    provenance,
  },
];

test('soma métrica apenas quando todos os territórios possuem dado', () => {
  assert.deepEqual(
    aggregateNumericMetric(
      ['a', 'b'],
      'population_total',
      facts,
    ),
    {
      value: 350,
      referencePeriod: '2022',
    },
  );

  assert.deepEqual(
    aggregateNumericMetric(
      ['a', 'b', 'c'],
      'population_total',
      facts,
    ),
    {
      value: null,
      referencePeriod: null,
    },
  );
});

test('conta locais por escopo e categoria sem inventar ausências', () => {
  assert.equal(countPlaces(['a', 'b'], places), 2);
  assert.equal(
    countPlaces(['a', 'b'], places, 'education'),
    1,
  );
  assert.equal(
    countPlaces(['a'], places, 'health'),
    0,
  );
});

test('deduplica fontes e aceita somente URLs http(s)', () => {
  const sources = collectSources(
    ['a', 'b'],
    facts,
    places,
  );

  assert.equal(sources.length, 1);
  assert.equal(
    sources[0].sourceUrl,
    'https://example.gov/dataset',
  );

  const unsafeFacts = [
    {
      ...facts[0],
      provenance: {
        ...provenance,
        datasetName: 'Unsafe',
        sourceUrl: 'javascript:alert(1)',
      },
    },
  ];

  const unsafe = collectSources(
    ['a'],
    unsafeFacts,
    [],
  );

  assert.equal(unsafe[0].sourceUrl, null);
});
