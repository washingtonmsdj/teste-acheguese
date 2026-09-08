import {
  loadPublicEnv,
  validatePublicEnv,
} from './public-env-contract.mjs';

const mode =
  process.argv[2] ||
  process.env.NODE_ENV ||
  'development';

const requirePublicConfig =
  process.env.ACHEGUESE_REQUIRE_PUBLIC_ENV === '1' ||
  (mode === 'production' && process.env.VERCEL === '1');

const result = validatePublicEnv(
  loadPublicEnv(mode),
  { requirePublicConfig },
);

if (!result.ok) {
  console.error(
    `[acheguese] public_env_invalid: ${result.error}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `[acheguese] public_env=PASS mode=${mode} required=${requirePublicConfig ? 'yes' : 'no'} supabase=${result.supabaseConfigured ? 'configured' : 'not-configured'}`,
  );
}
