# Repository Governance

> **Canonical project:** `washingtonmsdj/teste-acheguese`  
> **Canonical branch:** `main`  
> **Sequence authority:** `/URGENTE.md`

## 1. Purpose

This document defines repository-level safeguards for the active Achegue-se v2 line.

It complements CI and application security. It does not replace the release runbooks.

## 2. Main branch policy

Desired GitHub protection for `main`:

- prevent branch deletion;
- prevent force-push;
- require `quality` to pass;
- require `vercel-source-bundle` to pass;
- require branch to be up to date before merge if pull requests are used;
- require Code Owner review when the workflow later switches from direct-main to PR-based releases;
- do not allow bypass except explicit repository-owner emergency recovery.

### Current connector limitation

The connected GitHub integration can read repository Rulesets but cannot administer branch protection/rulesets.

At the 2026-09-07 checkpoint:

- repository Rulesets endpoint returned an empty collection;
- classic branch-protection state could not be read because the integration received HTTP 403 for the administrative endpoint.

Therefore **do not claim branch protection is enabled** until it is verified from a GitHub account with repository administration permission.

This is an external governance action, not a source-code blocker for the current pre-deploy candidate.

## 3. Direct-main discipline

Until repository protection is administratively enabled, automated work on `main` must:

1. read the current HEAD immediately before every write;
2. commit only on top of that exact HEAD;
3. update refs with `force=false`;
4. stop if `main` advanced concurrently;
5. require quality + bundle PASS after every source/release-policy change;
6. never rewrite published history.

These rules are already followed by the active implementation workflow.

## 4. Dependency governance

Dependabot is enabled for:

- npm;
- GitHub Actions.

Updates are weekly and should be merged only after the normal quality/security gates pass.

Production dependency audit remains a required CI step:

```bash
npm audit --omit=dev --audit-level=high
```

Do not approve dependency install scripts merely to silence warnings. Verify runtime necessity first.

## 5. Ownership

`.github/CODEOWNERS` assigns the repository owner as code owner, with explicit coverage for release/security-sensitive paths.

CODEOWNERS becomes enforcement only when GitHub branch/ruleset settings require Code Owner review.

## 6. Security reporting

`SECURITY.md` defines private vulnerability reporting expectations and secret-handling rules.

Public issues must not contain credentials, tokens, private data or exploitable details.

## 7. Legacy repository

`washingtonmsdj/acheguese` is donor/reference only.

Repository governance must not be duplicated there as if it were a second active line. Any future consolidation or rename is a release operation after FASE 4 is validated.

## 8. Release evidence

Before a candidate is treated as release-valid:

- `main` and `deploy/vercel-bundle/SOURCE_SHA` must match;
- `quality` must PASS;
- `vercel-source-bundle` must PASS;
- Supabase security advisor must have no unresolved release blocker;
- RLS smokes must PASS;
- deployment smoke must PASS;
- visual/runtime/Auth/Classificados E2E must PASS.

See the canonical runbooks for the complete gate.
