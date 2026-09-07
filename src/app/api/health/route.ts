import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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

  const { error } = await supabase
    .from('cities')
    .select('id')
    .eq('is_active', true)
    .limit(1);

  if (error) {
    return NextResponse.json(
      {
        status: 'degraded',
        database: 'unavailable',
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

  return NextResponse.json(
    {
      status: 'ok',
      database: 'ok',
      checkedAt,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
