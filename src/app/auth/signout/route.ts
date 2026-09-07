import { NextResponse, type NextRequest } from 'next/server';
import { isTrustedAuthRequestOrigin } from '@/lib/auth/origin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isTrustedAuthRequestOrigin(origin)) {
    return NextResponse.json(
      { error: 'auth_origin_invalid' },
      {
        status: 403,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL('/', request.url), {
    status: 303,
  });
}
