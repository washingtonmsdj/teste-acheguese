import type {
  TerritoryRolloutStage,
} from '@/core/territory';
import type { MapViewportData } from '@/core/map';

export type TerritoryHomeMetric = {
  value: number | null;
  referencePeriod: string | null;
};

export type TerritoryHomeNeighborhood = {
  id: string;
  slug: string;
  name: string;
  selected: boolean;
  population: TerritoryHomeMetric;
  households: TerritoryHomeMetric;
  educationCount: number;
  healthCount: number;
  publicPlaceCount: number;
};

export type TerritoryHomeSource = {
  providerName: string;
  datasetName: string;
  sourceUrl: string | null;
};

export type TerritoryHomeData = {
  scope: {
    kind: 'group' | 'territory';
    slug: string;
    name: string;
    rolloutStage: TerritoryRolloutStage;
    memberCount: number;
    population: TerritoryHomeMetric;
    households: TerritoryHomeMetric;
    educationCount: number;
    healthCount: number;
    publicPlaceCount: number;
  };
  neighborhoods: TerritoryHomeNeighborhood[];
  sources: TerritoryHomeSource[];
  mapData: MapViewportData;
};
