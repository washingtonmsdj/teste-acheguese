import {
  loadPublicEnv,
  validatePublicEnv,
} from './public-env-contract.mjs';

const mode =
  process.argv[2] ||
  process.env.NODE_ENV ||
  'development';

const requirePublicConfig =
  process.argv.includes('--require-public-config') ||
  process.env.ACHEGUESE_REQUIRE_PUBLIC_ENV === '1' ||
  (mode === 'production' && process.env.VERCEL === '1');

const result = validatePublicEnv(
  loadPublicEnv(mode),
  { requirePublicConfig },
);

if (!result.ok) {
  const guidance =
    result.error === 'supabase_required'
      ? ' copie .env.example para .env.local e preencha NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
      : result.error === 'site_url_required'
        ? ' configure NEXT_PUBLIC_SITE_URL'
        : '';

  console.error(
    `[acheguese] public_env_invalid: ${result.error}.${guidance}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `[acheguese] public_env=PASS mode=${mode} required=${requirePublicConfig ? 'yes' : 'no'} supabase=${result.supabaseConfigured ? 'configured' : 'not-configured'}`,
  );
}
