# Security Policy

## Supported branch

Security fixes are made only on the active canonical line:

- `main` of `washingtonmsdj/teste-acheguese`.

The legacy repository `washingtonmsdj/acheguese` is donor/reference only and is not the active product line.

## Reporting a vulnerability

Do **not** open a public issue with exploit details, credentials, tokens, personal data or proof-of-concept that could put users or infrastructure at risk.

Use GitHub's private security reporting / Security Advisories for this repository when available.

If private reporting is unavailable, contact the repository owner through a private channel and include only the minimum information needed to reproduce the issue safely.

## What to include

A useful report contains:

- affected surface or route;
- impact;
- reproduction steps;
- preconditions;
- whether authentication is required;
- affected commit/version if known;
- suggested mitigation if available.

Never include production secrets or personal data in a report.

## Security model

The project follows these release invariants:

- fail-closed public configuration;
- Supabase RLS as database authorization boundary;
- service-role/secret keys never shipped to browser/Vercel public env;
- Auth authority comes from signed `app_metadata`, never `user_metadata`;
- Territory/Map public RPCs enforce bounded query contracts;
- personal/admin surfaces are dynamic and `private, no-store`;
- CSP/HSTS are release requirements;
- production dependencies are audited in CI;
- tracked repository files are scanned for high-confidence committed secrets in CI;
- release smoke and RLS smoke must pass before release.

The canonical release checklist is documented in:

- `URGENTE.md`;
- `docs/RUNBOOK-TERRITORY-RELEASE.md`;
- `docs/RUNBOOK-CLASSIFICADOS-MVP.md`.

## Secret handling

Never commit:

- `.env*` with real credentials;
- `sb_secret_...`;
- service-role keys;
- passwords;
- access tokens;
- private signing material.

Only public/publishable configuration may be exposed to the browser.

Local/CI verification:

```bash
npm run security:scan
```

This scanner covers the current tracked tree. Historical Git secret exposure must still be checked through GitHub's administrative Secret Scanning/history surfaces before public launch.

## Legacy code

Code copied or adapted from the legacy Achegue-se repository must be audited before entering the v2. Legacy presence is not proof of security or correctness.
