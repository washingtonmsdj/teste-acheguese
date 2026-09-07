import type {
  BoundingBox,
  Coordinates,
} from '@/core/territory';
import type {
  GeoJsonMultiPolygon,
  GeoJsonPolygon,
} from '@/core/territory';

export type MapViewport = {
  center: Coordinates;
  zoom: number;
  bounds: BoundingBox;
};

export type MapLayerId =
  | 'boundaries'
  | 'public_places';

export type MapSourceReference = {
  key: string;
  providerName: string;
  datasetName: string;
  sourceUrl: string;
  attribution: string | null;
};

export type MapBoundaryFeature = {
  id: string;
  territoryId: string;
  territorySlug: string;
  territoryName: string;
  geographicPath: string;
  geometry: GeoJsonMultiPolygon;
  bboxGeometry: GeoJsonPolygon;
  areaInSquareMeters: number;
  source: MapSourceReference;
};

export type MapPointFeature = {
  id: string;
  territoryId: string;
  territorySlug: string;
  territoryName: string;
  geographicPath: string;
  kind: string;
  kindLabel: string;
  coordinates: Coordinates;
  title: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  source: MapSourceReference;
};

export type MapViewportQuery = {
  bounds: BoundingBox;
  zoom: number;
  layers: MapLayerId[];
  publicPlaceCategories?: string[];
  placeLimit?: number;
  boundaryLimit?: number;
};

export type MapViewportData = {
  bounds: BoundingBox;
  boundaries: MapBoundaryFeature[];
  points: MapPointFeature[];
};
