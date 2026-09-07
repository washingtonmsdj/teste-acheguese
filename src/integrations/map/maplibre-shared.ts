'use client';

import {
  setWorkerUrl,
  type GeoJSONSource,
  type Map as MapLibreMap,
} from 'maplibre-gl';
import type { MapViewportData } from '@/core/map';

export const MAPLIBRE_STYLE_URL =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim() ||
  'https://tiles.openfreemap.org/styles/liberty';

export const BOUNDARY_SOURCE = 'acheguese-boundaries';
export const PLACES_SOURCE = 'acheguese-public-places';

const BOUNDARY_FILL_LAYER = 'acheguese-boundary-fill';
const BOUNDARY_LINE_LAYER = 'acheguese-boundary-line';
const CLUSTER_LAYER = 'acheguese-place-clusters';
const CLUSTER_COUNT_LAYER = 'acheguese-place-cluster-count';
export const PLACE_POINT_LAYER = 'acheguese-place-points';

export function configureMapLibreWorker() {
  setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');
}

export function boundaryCollection(data: MapViewportData) {
  return {
    type: 'FeatureCollection' as const,
    features: data.boundaries.map((boundary) => ({
      type: 'Feature' as const,
      id: boundary.id,
      geometry: boundary.geometry,
      properties: {
        territoryId: boundary.territoryId,
        title: boundary.territoryName,
        slug: boundary.territorySlug,
      },
    })),
  };
}

export function pointCollection(data: MapViewportData) {
  return {
    type: 'FeatureCollection' as const,
    features: data.points.map((point) => ({
      type: 'Feature' as const,
      id: point.id,
      geometry: {
        type: 'Point' as const,
        coordinates: [
          point.coordinates.longitude,
          point.coordinates.latitude,
        ],
      },
      properties: {
        id: point.id,
        kind: point.kind,
        kindLabel: point.kindLabel,
        title: point.title,
        address: point.address ?? '',
        phone: point.phone ?? '',
        providerName: point.source.providerName,
      },
    })),
  };
}

type AddTerritoryLayersOptions = {
  clustered?: boolean;
  compact?: boolean;
  includePoints?: boolean;
};

export function addTerritoryMapLayers(
  map: MapLibreMap,
  data: MapViewportData,
  {
    clustered = true,
    compact = false,
    includePoints = true,
  }: AddTerritoryLayersOptions = {},
) {
  map.addSource(BOUNDARY_SOURCE, {
    type: 'geojson',
    data: boundaryCollection(data),
  });

  map.addLayer({
    id: BOUNDARY_FILL_LAYER,
    type: 'fill',
    source: BOUNDARY_SOURCE,
    paint: {
      'fill-color': '#0c9470',
      'fill-opacity': compact ? 0.12 : 0.08,
    },
  });

  map.addLayer({
    id: BOUNDARY_LINE_LAYER,
    type: 'line',
    source: BOUNDARY_SOURCE,
    paint: {
      'line-color': '#05624d',
      'line-width': compact ? 1.6 : 2.2,
      'line-opacity': 0.9,
    },
  });

  if (!includePoints) return;

  map.addSource(PLACES_SOURCE, {
    type: 'geojson',
    data: pointCollection(data),
    cluster: clustered,
    clusterRadius: clustered ? 48 : undefined,
    clusterMaxZoom: clustered ? 16 : undefined,
  });

  if (clustered) {
    map.addLayer({
      id: CLUSTER_LAYER,
      type: 'circle',
      source: PLACES_SOURCE,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#0b1830',
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          18,
          10,
          22,
          40,
          27,
        ],
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 3,
      },
    });

    map.addLayer({
      id: CLUSTER_COUNT_LAYER,
      type: 'symbol',
      source: PLACES_SOURCE,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-size': 12,
      },
      paint: {
        'text-color': '#ffffff',
      },
    });
  }

  map.addLayer({
    id: PLACE_POINT_LAYER,
    type: 'circle',
    source: PLACES_SOURCE,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': compact ? 5.5 : 8,
      'circle-color': [
        'match',
        ['get', 'kind'],
        'health',
        '#d8563f',
        'education',
        '#0c9470',
        '#0b1830',
      ],
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': compact ? 2 : 3,
    },
  });
}

export function syncTerritoryMapData(
  map: MapLibreMap,
  data: MapViewportData,
) {
  const boundarySource =
    map.getSource(BOUNDARY_SOURCE) as GeoJSONSource | undefined;
  const placeSource =
    map.getSource(PLACES_SOURCE) as GeoJSONSource | undefined;

  boundarySource?.setData(boundaryCollection(data));
  placeSource?.setData(pointCollection(data));
}
