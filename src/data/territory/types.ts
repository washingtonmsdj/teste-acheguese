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

export type TerritoryFactValue =
  | { type: 'numeric'; value: number; unit: string | null }
  | { type: 'text'; value: string; unit: string | null }
  | { type: 'boolean'; value: boolean; unit: string | null };

export type TerritoryFact = {
  id: string;
  territoryId: string;
  metricKey: string;
  referencePeriod: string;
  value: TerritoryFactValue;
  dimensions: Record<string, unknown>;
  sourceSnapshotId: string;
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
  name: string;
  latitude: number | null;
  longitude: number | null;
  addressText: string | null;
  neighborhoodLabel: string | null;
  postalCode: string | null;
  phone: string | null;
  website: string | null;
  sourceId: string;
  sourceSnapshotId: string;
};
