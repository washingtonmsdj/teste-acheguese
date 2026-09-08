'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTrustedAuthOrigin } from '@/lib/auth/origin';
import { safeInternalPath } from '@/lib/safe-path';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function readCredentials(formData: FormData) {
  const email =
    typeof formData.get('email') === 'string'
      ? String(formData.get('email')).trim().toLowerCase()
      : '';

  const password =
    typeof formData.get('password') === 'string'
      ? String(formData.get('password'))
      : '';

  return { email, password };
}

function authError(code: string, next: string): never {
  const params = new URLSearchParams({ erro: code, next });
  redirect(`/entrar?${params.toString()}`);
}

async function requireTrustedAuthOrigin(
  next: string,
): Promise<string> {
  const headerStore = await headers();
  const origin = getTrustedAuthOrigin(
    headerStore.get('origin'),
  );

  if (!origin) {
    authError('origem_invalida', next);
  }

  return origin;
}

export async function signInAction(formData: FormData) {
  const next = safeInternalPath(formData.get('next'), '/classificados/meus');
  const { email, password } = readCredentials(formData);

  if (!getSupabasePublicConfig()) {
    authError('indisponivel', next);
  }

  if (!email || password.length < 8) {
    authError('dados_invalidos', next);
  }

  await requireTrustedAuthOrigin(next);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    authError('credenciais_invalidas', next);
  }

  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const next = safeInternalPath(formData.get('next'), '/classificados/novo');
  const { email, password } = readCredentials(formData);

  if (!getSupabasePublicConfig()) {
    authError('indisponivel', next);
  }

  if (!email || password.length < 8) {
    authError('dados_invalidos', next);
  }

  const origin = await requireTrustedAuthOrigin(next);

  const supabase = await createSupabaseServerClient();
  const callback = new URL('/auth/callback', origin);
  callback.searchParams.set('next', next);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callback.toString(),
    },
  });

  if (error) {
    authError('cadastro_falhou', next);
  }

  const params = new URLSearchParams({
    mensagem: 'confirme_email',
    next,
  });
  redirect(`/entrar?${params.toString()}`);
}
