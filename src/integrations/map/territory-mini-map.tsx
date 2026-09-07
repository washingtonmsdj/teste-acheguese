'use client';

import {
  Map as MapLibreMap,
} from 'maplibre-gl';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { MapViewportData } from '@/core/map';
import {
  addTerritoryMapLayers,
  configureMapLibreWorker,
  MAPLIBRE_STYLE_URL,
} from '@/integrations/map/maplibre-shared';
import styles from './territory-mini-map.module.css';

type TerritoryMiniMapProps = {
  data: MapViewportData;
  ariaLabel?: string;
  className?: string;
  includePoints?: boolean;
};

export function TerritoryMiniMap({
  data,
  ariaLabel = 'Prévia do mapa territorial',
  className,
  includePoints = true,
}: TerritoryMiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [failed, setFailed] = useState(false);

  const center = useMemo(
    () => ({
      longitude: (data.bounds.west + data.bounds.east) / 2,
      latitude: (data.bounds.south + data.bounds.north) / 2,
    }),
    [data.bounds],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    configureMapLibreWorker();

    const map = new MapLibreMap({
      container: containerRef.current,
      style: MAPLIBRE_STYLE_URL,
      center: [center.longitude, center.latitude],
      zoom: 13,
      minZoom: 10,
      maxZoom: 19,
      interactive: false,
      attributionControl: false,
    });

    mapRef.current = map;
    map.getCanvas().tabIndex = -1;
    map.getCanvas().setAttribute('aria-hidden', 'true');

    map.on('load', () => {
      addTerritoryMapLayers(map, data, {
        clustered: false,
        compact: true,
        includePoints,
      });

      map.fitBounds(
        [
          [data.bounds.west, data.bounds.south],
          [data.bounds.east, data.bounds.north],
        ],
        {
          padding: 16,
          duration: 0,
        },
      );
    });

    map.on('error', () => {
      setFailed(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [
    center.latitude,
    center.longitude,
    data,
    includePoints,
  ]);

  const rootClassName = [
    styles.root,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (failed) {
    return (
      <div
        className={`${rootClassName} ${styles.fallback}`}
        role="img"
        aria-label={ariaLabel}
      >
        <span>Mapa indisponível</span>
        <small>Os dados territoriais continuam acessíveis em texto.</small>
      </div>
    );
  }

  return (
    <div
      className={rootClassName}
      role="img"
      aria-label={ariaLabel}
    >
      <div
        ref={containerRef}
        className={styles.canvas}
        aria-hidden="true"
      />
    </div>
  );
}
