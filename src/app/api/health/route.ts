import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import { getSupabasePublicConfig } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

const COMPLEXO_SLUG =
  'complexo-do-nordeste-de-amaralina';

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
        .eq('slug', COMPLEXO_SLUG)
        .maybeSingle(),
      supabase
        .from('cities')
        .select('id')
        .eq('slug', 'salvador')
        .eq('state_code', 'BA')
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
