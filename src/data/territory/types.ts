export type TerritoryDataSource = {
  id: string;
  key: string;
  providerName: string;
  datasetName: string;
  sourceUrl: string;
  licenseName: string | null;
  licenseUrl: string | null;
  attribution: string | null;
};

export type TerritoryDataSnapshot = {
  id: string;
  sourceId: string;
  sourceVersion: string | null;
  sourcePublishedAt: string | null;
  fetchedAt: string;
  status: 'pending' | 'verified' | 'rejected' | 'superseded';
};

export type TerritoryDataProvenance = {
  sourceId: string;
  sourceKey: string;
  providerName: string;
  datasetName: string;
  sourceUrl: string;
  attribution: string | null;
  sourceSnapshotId: string;
  sourceVersion: string | null;
  fetchedAt: string;
};

export type TerritoryFactValue =
  | { type: 'numeric'; value: number; unit: string | null }
  | { type: 'text'; value: string; unit: string | null }
  | { type: 'boolean'; value: boolean; unit: string | null };

export type TerritoryFact = {
  id: string;
  territoryId: string;
  metricKey: string;
  metricLabel: string;
  referencePeriod: string;
  value: TerritoryFactValue;
  dimensions: Record<string, unknown>;
  sourceRecordId: string | null;
  provenance: TerritoryDataProvenance;
};

export type PublicPlaceCategory = {
  key: string;
  parentKey: string | null;
  label: string;
};

export type PublicPlace = {
  id: string;
  territoryId: string;
  categoryKey: string;
  categoryLabel: string;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  addressText: string | null;
  neighborhoodLabel: string | null;
  postalCode: string | null;
  phone: string | null;
  website: string | null;
  externalId: string | null;
  provenance: TerritoryDataProvenance;
};
