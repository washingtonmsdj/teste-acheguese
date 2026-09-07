import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function safeNext(value: string | null) {
  if (!value?.startsWith('/') || value.startsWith('//')) {
    return '/';
  }

  return value;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = safeNext(url.searchParams.get('next'));

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
