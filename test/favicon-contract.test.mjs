import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import nextConfig from '../next.config.ts';

test('favicon possui asset textual e compatibilidade /favicon.ico', async () => {
  const favicon = readFileSync(
    new URL('../public/favicon.svg', import.meta.url),
    'utf8',
  );

  assert.match(favicon, /<svg\b/);
  assert.match(favicon, /#0b8a6a/i);

  const redirects = await nextConfig.redirects?.();
  assert.ok(Array.isArray(redirects));

  assert.equal(
    redirects.some(
      (redirect) =>
        redirect.source === '/favicon.ico' &&
        redirect.destination === '/favicon.svg' &&
        redirect.permanent === true,
    ),
    true,
  );
});
