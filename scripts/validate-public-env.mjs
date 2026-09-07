import {
  loadPublicEnv,
  validatePublicEnv,
} from './public-env-contract.mjs';

const mode =
  process.argv[2] ||
  process.env.NODE_ENV ||
  'development';

const result = validatePublicEnv(
  loadPublicEnv(mode),
);

if (!result.ok) {
  console.error(
    `[acheguese] public_env_invalid: ${result.error}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `[acheguese] public_env=PASS mode=${mode} supabase=${result.supabaseConfigured ? 'configured' : 'not-configured'}`,
  );
}
