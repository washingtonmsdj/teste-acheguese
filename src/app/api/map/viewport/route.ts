import { NextRequest, NextResponse } from 'next/server';
import type { MapLayerId } from '@/core/map';
import { SupabaseMapDataRepository } from '@/lib/supabase/map-data-repository';
import { createSupabasePublicServerClient } from '@/lib/supabase/public-server';

function numberParam(
  request: NextRequest,
  key: string,
): number {
  const raw = request.nextUrl.searchParams.get(key);
  const value = raw === null ? Number.NaN : Number(raw);

  if (!Number.isFinite(value)) {
    throw new Error(`map_query_invalid:${key}`);
  }

  return value;
}

function parseLayers(
  request: NextRequest,
): MapLayerId[] {
  const raw =
    request.nextUrl.searchParams.get('layers') ??
    'boundaries,public_places';

  const values = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const allowed = new Set<MapLayerId>([
    'boundaries',
    'public_places',
  ]);

  if (
    !values.length ||
    values.some(
      (value) => !allowed.has(value as MapLayerId),
    )
  ) {
    throw new Error('map_query_invalid:layers');
  }

  return [...new Set(values)] as MapLayerId[];
}

function parseCategories(
  request: NextRequest,
): string[] | undefined {
  const raw = request.nextUrl.searchParams.get('categories');

  if (!raw) return undefined;

  const values = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (
    values.length > 10 ||
    values.some(
      (value) => !/^[a-z0-9_]{1,64}$/.test(value),
    )
  ) {
    throw new Error('map_query_invalid:categories');
  }

  return values.length
    ? [...new Set(values)]
    : undefined;
}

export async function GET(request: NextRequest) {
  const supabase = createSupabasePublicServerClient();

  if (!supabase) {
    return NextResponse.json(
      { error: 'map_data_unavailable' },
      { status: 503 },
    );
  }

  try {
    const repository = new SupabaseMapDataRepository(supabase);
    const data = await repository.loadViewport({
      bounds: {
        west: numberParam(request, 'west'),
        south: numberParam(request, 'south'),
        east: numberParam(request, 'east'),
        north: numberParam(request, 'north'),
      },
      zoom: numberParam(request, 'zoom'),
      layers: parseLayers(request),
      publicPlaceCategories: parseCategories(request),
      placeLimit: 200,
      boundaryLimit: 100,
    });

    return NextResponse.json(data, {
      headers: {
        'Cache-Control':
          'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'map_query_failed';

    const isInputError =
      message.startsWith('map_bbox_') ||
      message.startsWith('map_zoom_') ||
      message.startsWith('map_query_invalid');

    return NextResponse.json(
      { error: isInputError ? message : 'map_query_failed' },
      { status: isInputError ? 400 : 500 },
    );
  }
}
