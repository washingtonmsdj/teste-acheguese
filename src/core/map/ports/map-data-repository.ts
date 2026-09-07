import type {
  MapViewportData,
  MapViewportQuery,
} from '@/core/map/domain/types';

export interface MapDataRepository {
  loadViewport(
    query: MapViewportQuery,
  ): Promise<MapViewportData>;
}
