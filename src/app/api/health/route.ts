import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { reportServerError } from '@/core/observability/server-log';
import { territoryReleaseScope } from '@/config/territory-release-scope';
import type { Database } from '@/lib/supabase/database.types';
import { getSupabasePublicConfig } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checkedAt = new Date().toISOString();
  const config = getSupabasePublicConfig();

  if (!config) {
    return NextResponse.json(
      {
        status: 'degraded',
        database: 'not_configured',
        territory: 'not_configured',
        classifieds: 'not_configured',
        checkedAt,
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  const supabase = createClient<Database>(
    config.url,
    config.publishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  const [territoryResult, classifiedsResult] =
    await Promise.all([
      supabase
        .from('territory_rollout_catalog')
        .select('stage')
        .eq('target_kind', 'group')
        .eq('slug', territoryReleaseScope.group.slug)
        .maybeSingle(),
      supabase
        .from('cities')
        .select('id')
        .eq('slug', territoryReleaseScope.city.slug)
        .eq('state_code', territoryReleaseScope.city.stateCode)
        .eq('is_active', true)
        .maybeSingle(),
    ]);

  const territoryOk =
    !territoryResult.error &&
    Boolean(territoryResult.data);
  const classifiedsOk =
    !classifiedsResult.error &&
    Boolean(classifiedsResult.data);
  const healthy = territoryOk && classifiedsOk;

  if (!territoryOk) {
    reportServerError(
      'health.territory_canary_failed',
      territoryResult.error ??
        new Error('territory_canary_missing'),
    );
  }

  if (!classifiedsOk) {
    reportServerError(
      'health.classifieds_canary_failed',
      classifiedsResult.error ??
        new Error('classifieds_canary_missing'),
    );
  }

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      database: healthy ? 'ok' : 'unavailable',
      territory: territoryOk ? 'ok' : 'unavailable',
      classifieds: classifiedsOk ? 'ok' : 'unavailable',
      checkedAt,
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
