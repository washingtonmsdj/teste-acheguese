'use client';

import {
  Map as MapLibreMap,
  NavigationControl,
  Popup,
  setWorkerUrl,
  type GeoJSONSource,
  type MapGeoJSONFeature,
} from 'maplibre-gl';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { MapViewportData } from '@/core/map';
import styles from '@/app/mapa/mapa.module.css';

const DEFAULT_STYLE_URL =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim() ||
  'https://tiles.openfreemap.org/styles/liberty';

const BOUNDARY_SOURCE = 'acheguese-boundaries';
const PLACES_SOURCE = 'acheguese-public-places';

type TerritoryMapExplorerProps = {
  initialData: MapViewportData;
  initialZoom: number;
};

function boundaryCollection(data: MapViewportData) {
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

function pointCollection(data: MapViewportData) {
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

function syncMapData(
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

function popupContent(feature: MapGeoJSONFeature) {
  const container = document.createElement('div');
  const title = document.createElement('strong');
  const meta = document.createElement('p');

  title.textContent = String(
    feature.properties?.title ?? 'Local',
  );
  meta.textContent = [
    feature.properties?.kindLabel,
    feature.properties?.address,
  ]
    .filter(Boolean)
    .join(' · ');

  container.append(title, meta);
  return container;
}

export function TerritoryMapExplorer({
  initialData,
  initialZoom,
}: TerritoryMapExplorerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const categoriesRef = useRef<string[]>([
    'education',
    'health',
  ]);

  const [data, setData] = useState(initialData);
  const [categories, setCategories] = useState([
    'education',
    'health',
  ]);
  const [loading, setLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const center = useMemo(() => ({
    longitude:
      (initialData.bounds.west + initialData.bounds.east) / 2,
    latitude:
      (initialData.bounds.south + initialData.bounds.north) / 2,
  }), [initialData.bounds]);

  const loadViewport = useCallback(
    async (map: MapLibreMap, nextCategories: string[]) => {
      const bounds = map.getBounds();
      const controller = new AbortController();

      requestRef.current?.abort();
      requestRef.current = controller;
      setLoading(true);

      const layers = nextCategories.length
        ? 'boundaries,public_places'
        : 'boundaries';

      const params = new URLSearchParams({
        west: String(bounds.getWest()),
        south: String(bounds.getSouth()),
        east: String(bounds.getEast()),
        north: String(bounds.getNorth()),
        zoom: String(map.getZoom()),
        layers,
      });

      if (nextCategories.length) {
        params.set('categories', nextCategories.join(','));
      }

      try {
        const response = await fetch(
          `/api/map/viewport?${params.toString()}`,
          {
            signal: controller.signal,
            headers: {
              accept: 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('map_viewport_fetch_failed');
        }

        const nextData =
          (await response.json()) as MapViewportData;

        setData(nextData);
        syncMapData(map, nextData);
        setMapError(null);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return;
        }

        setMapError(
          'Não foi possível atualizar esta área do mapa.',
        );
      } finally {
        if (requestRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: DEFAULT_STYLE_URL,
      center: [center.longitude, center.latitude],
      zoom: initialZoom,
      minZoom: 11,
      maxZoom: 19,
      attributionControl: { compact: true },
      cooperativeGestures: true,
    });

    mapRef.current = map;

    map.addControl(
      new NavigationControl({ showCompass: false }),
      'bottom-right',
    );

    map.on('load', () => {
      map.addSource(BOUNDARY_SOURCE, {
        type: 'geojson',
        data: boundaryCollection(initialData),
      });

      map.addLayer({
        id: 'acheguese-boundary-fill',
        type: 'fill',
        source: BOUNDARY_SOURCE,
        paint: {
          'fill-color': '#0c9470',
          'fill-opacity': 0.08,
        },
      });

      map.addLayer({
        id: 'acheguese-boundary-line',
        type: 'line',
        source: BOUNDARY_SOURCE,
        paint: {
          'line-color': '#05624d',
          'line-width': 2.2,
          'line-opacity': 0.9,
        },
      });

      map.addSource(PLACES_SOURCE, {
        type: 'geojson',
        data: pointCollection(initialData),
        cluster: true,
        clusterRadius: 48,
        clusterMaxZoom: 16,
      });

      map.addLayer({
        id: 'acheguese-place-clusters',
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
        id: 'acheguese-place-cluster-count',
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

      map.addLayer({
        id: 'acheguese-place-points',
        type: 'circle',
        source: PLACES_SOURCE,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': 8,
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
          'circle-stroke-width': 3,
        },
      });

      map.fitBounds(
        [
          [
            initialData.bounds.west,
            initialData.bounds.south,
          ],
          [
            initialData.bounds.east,
            initialData.bounds.north,
          ],
        ],
        {
          padding: 40,
          duration: 0,
        },
      );
    });

    map.on('moveend', () => {
      void loadViewport(map, categoriesRef.current);
    });

    map.on(
      'click',
      'acheguese-place-points',
      (event) => {
        const feature = event.features?.[0];

        if (
          !feature ||
          feature.geometry.type !== 'Point'
        ) {
          return;
        }

        const [longitude, latitude] =
          feature.geometry.coordinates;

        if (
          typeof longitude !== 'number' ||
          typeof latitude !== 'number'
        ) {
          return;
        }

        new Popup({
          closeButton: true,
          maxWidth: '320px',
        })
          .setLngLat([longitude, latitude])
          .setDOMContent(popupContent(feature))
          .addTo(map);
      },
    );

    map.on(
      'click',
      'acheguese-place-clusters',
      async (event) => {
        const feature = event.features?.[0];

        if (
          !feature ||
          feature.geometry.type !== 'Point'
        ) {
          return;
        }

        const clusterId = Number(
          feature.properties?.cluster_id,
        );

        if (!Number.isFinite(clusterId)) {
          return;
        }

        const source =
          map.getSource(PLACES_SOURCE) as GeoJSONSource;

        try {
          const zoom =
            await source.getClusterExpansionZoom(clusterId);

          map.easeTo({
            center: feature.geometry.coordinates as [
              number,
              number,
            ],
            zoom,
          });
        } catch {
          // Cluster expansion is an enhancement; viewport
          // loading remains usable if the provider rejects it.
        }
      },
    );

    map.on('error', () => {
      setMapError(
        'O mapa-base apresentou uma falha. Os dados territoriais continuam disponíveis na lista.',
      );
    });

    return () => {
      requestRef.current?.abort();
      map.remove();
      mapRef.current = null;
    };
  }, [
    center.latitude,
    center.longitude,
    initialData,
    initialZoom,
    loadViewport,
  ]);

  const toggleCategory = (category: string) => {
    const next = categories.includes(category)
      ? categories.filter((item) => item !== category)
      : [...categories, category];

    categoriesRef.current = next;
    setCategories(next);

    if (mapRef.current) {
      void loadViewport(mapRef.current, next);
    }
  };

  return (
    <section className={styles.shell}>
      <aside className={styles.sidebar}>
        <div>
          <p className="eyebrow">Complexo do Nordeste</p>
          <h1>Mapa do território</h1>
          <p className={styles.intro}>
            Explore boundaries oficiais, escolas e unidades
            SUS verificadas. O mapa carrega somente o
            viewport visível.
          </p>
        </div>

        <div className={styles.summary}>
          <div>
            <strong>{data.boundaries.length}</strong>
            <span>bairros visíveis</span>
          </div>
          <div>
            <strong>{data.points.length}</strong>
            <span>locais no viewport</span>
          </div>
        </div>

        <div
          className={styles.filters}
          aria-label="Camadas do mapa"
        >
          <strong>Camadas</strong>
          <button
            className={
              categories.includes('education')
                ? styles.filterActive
                : undefined
            }
            type="button"
            onClick={() => toggleCategory('education')}
            aria-pressed={categories.includes('education')}
          >
            <span aria-hidden="true">●</span>
            Educação
          </button>
          <button
            className={
              categories.includes('health')
                ? styles.filterActive
                : undefined
            }
            type="button"
            onClick={() => toggleCategory('health')}
            aria-pressed={categories.includes('health')}
          >
            <span aria-hidden="true">●</span>
            Saúde SUS
          </button>
        </div>

        <div className={styles.placeList}>
          <div className={styles.placeListHeader}>
            <strong>Locais visíveis</strong>
            {loading && <span>Atualizando…</span>}
          </div>

          {data.points.length ? (
            data.points.slice(0, 20).map((point) => (
              <article key={point.id}>
                <span
                  className={
                    point.kind === 'health'
                      ? styles.healthDot
                      : styles.educationDot
                  }
                  aria-hidden="true"
                />
                <div>
                  <strong>{point.title}</strong>
                  <small>
                    {point.kindLabel} · {point.territoryName}
                  </small>
                  {point.address && <p>{point.address}</p>}
                </div>
              </article>
            ))
          ) : (
            <p className={styles.empty}>
              Nenhum local desta camada no viewport atual.
            </p>
          )}
        </div>

        <p className={styles.provenance}>
          Dados territoriais: GeoSalvador e CNES/Ministério
          da Saúde. Mapa-base: OpenFreeMap/OpenStreetMap.
        </p>
      </aside>

      <div className={styles.mapStage}>
        <div
          ref={mapContainerRef}
          className={styles.map}
          aria-label="Mapa interativo do Complexo do Nordeste de Amaralina"
        />
        {mapError && (
          <div className={styles.mapError} role="status">
            {mapError}
          </div>
        )}
      </div>
    </section>
  );
}
