import { NextResponse, type NextRequest } from 'next/server';
import { isTrustedAuthCallbackOrigin } from '@/lib/auth/origin';
import { safeInternalPath } from '@/lib/safe-path';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = safeInternalPath(
    url.searchParams.get('next'),
    '/',
  );

  if (!isTrustedAuthCallbackOrigin(url.origin)) {
    const failure = new URL('/entrar', url.origin);
    failure.searchParams.set('erro', 'origem_invalida');
    failure.searchParams.set('next', next);
    return NextResponse.redirect(failure);
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  const failure = new URL('/entrar', url.origin);
  failure.searchParams.set('erro', 'confirmacao_falhou');
  failure.searchParams.set('next', next);
  return NextResponse.redirect(failure);
}
