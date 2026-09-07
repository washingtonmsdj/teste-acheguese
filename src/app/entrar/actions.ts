'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSupabasePublicConfig } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function safePath(value: FormDataEntryValue | null, fallback = '/') {
  if (typeof value !== 'string') return fallback;
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
}

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

function authError(code: string, next: string) {
  const params = new URLSearchParams({ erro: code, next });
  redirect(`/entrar?${params.toString()}`);
}

export async function signInAction(formData: FormData) {
  const next = safePath(formData.get('next'), '/classificados/meus');
  const { email, password } = readCredentials(formData);

  if (!getSupabasePublicConfig()) {
    authError('indisponivel', next);
  }

  if (!email || password.length < 8) {
    authError('dados_invalidos', next);
  }

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
  const next = safePath(formData.get('next'), '/classificados/novo');
  const { email, password } = readCredentials(formData);

  if (!getSupabasePublicConfig()) {
    authError('indisponivel', next);
  }

  if (!email || password.length < 8) {
    authError('dados_invalidos', next);
  }

  const headerStore = await headers();
  const origin = headerStore.get('origin');

  if (!origin) {
    authError('origem_invalida', next);
  }

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
