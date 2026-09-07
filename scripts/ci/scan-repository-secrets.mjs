import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const ALLOWED_ENV_FILES = new Set(['.env.example']);

const forbiddenPathPatterns = [
  /(^|\/)\.env(?:\..+)?$/i,
  /\.(?:pem|p12|pfx|key|keystore|jks)$/i,
  /(^|\/)(?:id_rsa|id_ed25519)$/i,
];

const secretPatterns = [
  {
    name: 'supabase_secret_key',
    regex: /\bsb_secret_[A-Za-z0-9_-]{24,}\b/g,
  },
  {
    name: 'github_classic_token',
    regex: /\bghp_[A-Za-z0-9]{36}\b/g,
  },
  {
    name: 'github_fine_grained_token',
    regex: /\bgithub_pat_[A-Za-z0-9_]{40,}\b/g,
  },
  {
    name: 'aws_access_key',
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    name: 'private_key_block',
    regex:
      /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
  {
    name: 'sensitive_env_assignment',
    regex:
      /\b(?:SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SECRET_KEY|POSTGRES_PASSWORD|DATABASE_URL|PRIVATE_KEY|AWS_SECRET_ACCESS_KEY)\s*=\s*["']?[^\s"'#]{12,}/g,
  },
];

function trackedFiles() {
  const output = execFileSync(
    'git',
    ['ls-files', '-z'],
    { encoding: 'utf8' },
  );

  return output
    .split('\0')
    .filter(Boolean);
}

function isForbiddenPath(path) {
  if (ALLOWED_ENV_FILES.has(path)) return false;

  return forbiddenPathPatterns.some((pattern) =>
    pattern.test(path),
  );
}

function isProbablyBinary(buffer) {
  const length = Math.min(buffer.length, 8192);

  for (let index = 0; index < length; index += 1) {
    if (buffer[index] === 0) return true;
  }

  return false;
}

const findings = [];

for (const path of trackedFiles()) {
  if (isForbiddenPath(path)) {
    findings.push({
      path,
      type: 'forbidden_sensitive_file',
    });
    continue;
  }

  const buffer = readFileSync(path);

  if (isProbablyBinary(buffer)) continue;

  const content = buffer.toString('utf8');

  for (const { name, regex } of secretPatterns) {
    regex.lastIndex = 0;

    if (regex.test(content)) {
      findings.push({
        path,
        type: name,
      });
    }
  }
}

if (findings.length > 0) {
  console.error(
    '[acheguese] repository_secret_scan=FAIL',
  );

  for (const finding of findings) {
    console.error(
      `[acheguese] secret_finding type=${finding.type} path=${finding.path}`,
    );
  }

  process.exitCode = 1;
} else {
  console.log(
    '[acheguese] repository_secret_scan=PASS',
  );
}
