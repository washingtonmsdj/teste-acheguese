import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { parseHttpOrigin } from '../src/lib/public-url.ts';
import { parseSupabasePublicConfig } from '../src/lib/supabase/config.ts';

function envFiles(mode) {
  return [
    '.env',
    `.env.${mode}`,
    ...(mode === 'test' ? [] : ['.env.local']),
    `.env.${mode}.local`,
  ];
}

export function loadPublicEnv(
  mode,
  baseEnv = process.env,
) {
  const values = {};

  for (const path of envFiles(mode)) {
    if (!existsSync(path)) continue;

    Object.assign(
      values,
      parseEnv(readFileSync(path, 'utf8')),
    );
  }

  for (const key of [
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_MAP_STYLE_URL',
    'NEXT_PUBLIC_MAP_CSP_ORIGINS',
  ]) {
    if (baseEnv[key] !== undefined) {
      values[key] = baseEnv[key];
    }
  }

  return values;
}

function validHttpUrl(value) {
  try {
    const url = new URL(value);
    return (
      (url.protocol === 'https:' ||
        url.protocol === 'http:') &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function validatePublicEnv(values) {
  const supabaseUrl =
    values.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey =
    values.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (Boolean(supabaseUrl) !== Boolean(supabaseKey)) {
    return {
      ok: false,
      error: 'supabase_pair_incomplete',
    };
  }

  if (
    supabaseUrl &&
    !parseSupabasePublicConfig(
      supabaseUrl,
      supabaseKey,
    )
  ) {
    return {
      ok: false,
      error: 'supabase_url_invalid',
    };
  }

  const siteUrl = values.NEXT_PUBLIC_SITE_URL?.trim();

  if (siteUrl && !parseHttpOrigin(siteUrl)) {
    return {
      ok: false,
      error: 'site_url_invalid',
    };
  }

  const mapStyleUrl =
    values.NEXT_PUBLIC_MAP_STYLE_URL?.trim();

  if (mapStyleUrl && !validHttpUrl(mapStyleUrl)) {
    return {
      ok: false,
      error: 'map_style_url_invalid',
    };
  }

  const cspOrigins =
    values.NEXT_PUBLIC_MAP_CSP_ORIGINS?.trim();

  if (cspOrigins) {
    for (const item of cspOrigins.split(',')) {
      if (!parseHttpOrigin(item)) {
        return {
          ok: false,
          error: 'map_csp_origin_invalid',
        };
      }
    }
  }

  return {
    ok: true,
    supabaseConfigured: Boolean(supabaseUrl),
  };
}
