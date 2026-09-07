# Backend integration checkpoint

## Status

The application code now includes the official Supabase SSR client boundary, but it is intentionally **not activated** because the new Supabase project could not yet be created.

The organization currently has reached its free active-project limit. The existing legacy project named `acheguese` remains untouched.

## Installed integration boundary

- `src/lib/supabase/config.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/auth.ts`

The clients require:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

No secret/service-role key belongs in the browser.

## Authentication rule

Server authorization must use validated claims through `supabase.auth.getClaims()`.

A Next.js request proxy for token refresh will only be enabled after the dedicated Supabase project exists, so a missing environment cannot break the public shell.

## Classified validation

`src/features/classifieds/domain/classified-form.ts` validates untrusted form input before persistence:

- title length;
- description length;
- canonical category;
- canonical condition;
- BRL price converted to integer cents;
- city identifier;
- neighborhood length.

The next backend checkpoint is:

1. free/create an isolated Supabase project;
2. configure publishable project settings;
3. generate the real migration from the reviewed SQL draft;
4. run RLS tests and database advisors;
5. generate database types;
6. enable SSR refresh proxy;
7. wire authenticated create/edit flows.
