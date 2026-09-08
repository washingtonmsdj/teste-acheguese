'use client';

import {
  Map as MapLibreMap,
  NavigationControl,
  Popup,
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
import Link from 'next/link';
import {
  formatMapUrlState,
  type MapPointFeature,
  type MapViewportData,
} from '@/core/map';
import {
  addTerritoryMapLayers,
  configureMapLibreWorker,
  MAPLIBRE_STYLE_URL,
  PLACES_SOURCE,
  PLACE_POINT_LAYER,
  syncTerritoryMapData,
} from '@/integrations/map/maplibre-shared';
import styles from '@/app/mapa/mapa.module.css';

const CLUSTER_LAYER = 'acheguese-place-clusters';

type TerritoryMapExplorerProps = {
  initialData: MapViewportData;
  initialZoom: number;
  initialCategories: string[];
};

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

function pointPopupContent(point: MapPointFeature) {
  const container = document.createElement('div');
  const title = document.createElement('strong');
  const meta = document.createElement('p');

  title.textContent = point.title;
  meta.textContent = [
    point.kindLabel,
    point.address,
  ]
    .filter(Boolean)
    .join(' · ');

  container.append(title, meta);
  return container;
}

function prefersReducedMotion() {
  return window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
}

export function TerritoryMapExplorer({
  initialData,
  initialZoom,
  initialCategories,
}: TerritoryMapExplorerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const categoriesRef = useRef<string[]>([
    ...initialCategories,
  ]);

  const [data, setData] = useState(initialData);
  const [categories, setCategories] = useState([
    ...initialCategories,
  ]);
  const [loading, setLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const center = useMemo(
    () => ({
      longitude:
        (initialData.bounds.west + initialData.bounds.east) / 2,
      latitude:
        (initialData.bounds.south + initialData.bounds.north) / 2,
    }),
    [initialData.bounds],
  );

  const visibleEducation = data.points.filter(
    (point) => point.kind === 'education',
  ).length;
  const visibleHealth = data.points.filter(
    (point) => point.kind === 'health',
  ).length;

  const loadViewport = useCallback(
    async (
      map: MapLibreMap,
      nextCategories: string[],
    ) => {
      const bounds = map.getBounds();
      const controller = new AbortController();

      requestRef.current?.abort();
      requestRef.current = controller;
      setLoading(true);

      const layers = nextCategories.length
        ? 'boundaries,public_places'
        : 'boundaries';

      const urlState = formatMapUrlState({
        bounds: {
          west: bounds.getWest(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          north: bounds.getNorth(),
        },
        zoom: map.getZoom(),
        categories: nextCategories,
      });

      const currentUrl = new URL(window.location.href);
      for (const [key, value] of Object.entries(urlState)) {
        currentUrl.searchParams.set(key, value);
      }
      window.history.replaceState(
        null,
        '',
        currentUrl.pathname + currentUrl.search,
      );

      const params = new URLSearchParams({
        west: urlState.west,
        south: urlState.south,
        east: urlState.east,
        north: urlState.north,
        zoom: urlState.zoom,
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
        syncTerritoryMapData(map, nextData);
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
          requestRef.current = null;
          setLoading(false);
        }
      }
    },
    [],
  );

  const focusPoint = useCallback(
    (point: MapPointFeature) => {
      const map = mapRef.current;
      if (!map) return;

      const centerPoint: [number, number] = [
        point.coordinates.longitude,
        point.coordinates.latitude,
      ];
      const zoom = Math.max(map.getZoom(), 16);

      if (prefersReducedMotion()) {
        map.jumpTo({
          center: centerPoint,
          zoom,
        });
      } else {
        map.easeTo({
          center: centerPoint,
          zoom,
          duration: 420,
        });
      }

      new Popup({
        closeButton: true,
        maxWidth: '320px',
      })
        .setLngLat(centerPoint)
        .setDOMContent(pointPopupContent(point))
        .addTo(map);

      if (window.matchMedia('(max-width: 979px)').matches) {
        mapContainerRef.current?.scrollIntoView({
          behavior: prefersReducedMotion()
            ? 'auto'
            : 'smooth',
          block: 'center',
        });
      }
    },
    [],
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    configureMapLibreWorker();

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: MAPLIBRE_STYLE_URL,
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
      addTerritoryMapLayers(map, initialData, {
        clustered: true,
      });

      void loadViewport(map, categoriesRef.current);
    });

    map.on('moveend', () => {
      void loadViewport(map, categoriesRef.current);
    });

    map.on(
      'click',
      PLACE_POINT_LAYER,
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
      CLUSTER_LAYER,
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

          const centerPoint = feature.geometry.coordinates as [
            number,
            number,
          ];

          if (prefersReducedMotion()) {
            map.jumpTo({
              center: centerPoint,
              zoom,
            });
          } else {
            map.easeTo({
              center: centerPoint,
              zoom,
              duration: 360,
            });
          }
        } catch {
          // Cluster expansion is enhancement-only. The
          // viewport query and textual fallback stay usable.
        }
      },
    );

    for (const layerId of [
      PLACE_POINT_LAYER,
      CLUSTER_LAYER,
    ]) {
      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
      });
    }

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
      <aside className={styles.controlsPane}>
        <Link className={styles.backLink} href="/">
          ← Voltar ao território
        </Link>

        <div>
          <p className="eyebrow">
            Complexo do Nordeste de Amaralina
          </p>
          <h1>Mapa do território</h1>
          <p className={styles.intro}>
            Movimente o mapa para explorar bairros, escolas
            e unidades SUS. Os resultados acompanham a área
            que está visível.
          </p>
        </div>

        <div className={styles.summary}>
          <div>
            <strong>{data.boundaries.length}</strong>
            <span>bairros visíveis</span>
          </div>
          <div>
            <strong>{data.points.length}</strong>
            <span>locais no mapa</span>
          </div>
        </div>

        <div
          className={styles.filters}
          aria-label="Camadas do mapa"
        >
          <div className={styles.filterHeading}>
            <strong>Camadas</strong>
            <span>O que mostrar</span>
          </div>
          <button
            className={
              categories.includes('education')
                ? `${styles.filterActive} ${styles.filterEducationActive}`
                : undefined
            }
            type="button"
            onClick={() => toggleCategory('education')}
            aria-pressed={categories.includes('education')}
          >
            <span
              className={styles.educationDot}
              aria-hidden="true"
            />
            <span className={styles.filterButtonText}>
              <strong>Educação</strong>
              <small>{visibleEducation} visíveis</small>
            </span>
          </button>
          <button
            className={
              categories.includes('health')
                ? `${styles.filterActive} ${styles.filterHealthActive}`
                : undefined
            }
            type="button"
            onClick={() => toggleCategory('health')}
            aria-pressed={categories.includes('health')}
          >
            <span
              className={styles.healthDot}
              aria-hidden="true"
            />
            <span className={styles.filterButtonText}>
              <strong>Saúde SUS</strong>
              <small>{visibleHealth} visíveis</small>
            </span>
          </button>
        </div>
      </aside>

      <div className={styles.mapStage}>
        <p
          id="territory-map-help"
          className={styles.visuallyHidden}
        >
          Use os controles do mapa para aproximar ou afastar.
          A lista de locais oferece uma alternativa acessível
          para focalizar cada ponto.
        </p>

        <div
          ref={mapContainerRef}
          className={styles.map}
          role="region"
          aria-label="Mapa interativo do Complexo do Nordeste de Amaralina"
          aria-describedby="territory-map-help"
        />

        <div
          className={styles.mapHud}
          aria-live="polite"
          aria-atomic="true"
        >
          <span>Dados oficiais · viewport atual</span>
          <span>{data.points.length} locais</span>
          {loading && (
            <span className={styles.mapStatusLoading}>
              Atualizando…
            </span>
          )}
        </div>

        {mapError && (
          <div className={styles.mapError} role="status">
            {mapError}
          </div>
        )}
      </div>

      <aside className={styles.resultsPane}>
        <div className={styles.placeList}>
          <div className={styles.placeListHeader}>
            <div>
              <strong>Locais na área visível</strong>
              <span>Selecione para localizar no mapa</span>
            </div>
            <small>{data.points.length} resultados</small>
          </div>

          {data.points.length ? (
            data.points.slice(0, 20).map((point) => (
              <article key={point.id}>
                <button
                  className={styles.placeButton}
                  type="button"
                  onClick={() => focusPoint(point)}
                  aria-label={`Ver ${point.title} no mapa`}
                >
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
                  <span
                    className={styles.placeArrow}
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </button>
              </article>
            ))
          ) : (
            <p className={styles.empty}>
              Nenhum local desta categoria na área visível.
            </p>
          )}
        </div>

        <p className={styles.provenance}>
          Território e educação: GeoSalvador. Saúde:
          CNES/Ministério da Saúde. Mapa-base:
          OpenFreeMap/OpenStreetMap.
        </p>
      </aside>
    </section>
  );
}
