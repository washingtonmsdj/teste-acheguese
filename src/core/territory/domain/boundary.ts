export type GeoJsonPosition = [
  longitude: number,
  latitude: number,
];

export type GeoJsonLinearRing = GeoJsonPosition[];

export type GeoJsonPolygonCoordinates = GeoJsonLinearRing[];

export type GeoJsonPolygon = {
  type: 'Polygon';
  coordinates: GeoJsonPolygonCoordinates;
};

export type GeoJsonMultiPolygon = {
  type: 'MultiPolygon';
  coordinates: GeoJsonPolygonCoordinates[];
};

export type TerritoryBoundary = {
  territoryId: string;
  slug: string;
  name: string;
  geographicPath: string;
  centerLatitude: number | null;
  centerLongitude: number | null;
  sourceName: string;
  sourceUrl: string | null;
  sourceObjectId: string | null;
  geojson: GeoJsonMultiPolygon;
  bboxGeojson: GeoJsonPolygon;
  areaInSquareMeters: number;
  importedAt: string;
  updatedAt: string;
};
