import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const manifest = JSON.parse(
  readFileSync(
    new URL(
      '../infra/vercel-source-manifest.json',
      import.meta.url,
    ),
    'utf8',
  ),
);

const packageJson = JSON.parse(
  readFileSync(
    new URL('../package.json', import.meta.url),
    'utf8',
  ),
);

function localLifecycleFiles() {
  const result = new Set();

  for (const command of Object.values(
    packageJson.scripts ?? {},
  )) {
    if (typeof command !== 'string') continue;

    for (const match of command.matchAll(
      /node\s+\.\/(scripts\/[A-Za-z0-9._/-]+)/g,
    )) {
      result.add(match[1]);
    }
  }

  return [...result];
}

test('bundle inclui scripts locais exigidos pelo ciclo npm', () => {
  const files = new Set(manifest.files);

  for (const file of localLifecycleFiles()) {
    assert.equal(
      files.has(file),
      true,
      `script de build ausente do bundle: ${file}`,
    );
  }
});

test('bundle inclui source e public sem abrir a raiz inteira', () => {
  assert.deepEqual(
    [...manifest.directories].sort(),
    ['public', 'src'],
  );
  assert.equal(
    manifest.directories.includes('.'),
    false,
  );
});

test('manifesto de deploy não inclui arquivos de ambiente', () => {
  const values = [
    ...manifest.files,
    ...manifest.directories,
  ];

  assert.equal(
    values.some(
      (value) =>
        value === '.env' ||
        value.startsWith('.env.'),
    ),
    false,
  );
});
