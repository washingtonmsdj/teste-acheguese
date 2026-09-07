# Postgres / Supabase

Este diretório existiu durante a fase de desenho inicial do banco.

O schema do novo Achegue-se **não possui mais drafts SQL paralelos**.

## Fonte canônica

A única fonte de verdade para DDL é:

`supabase/migrations/`

O histórico desse diretório deve permanecer alinhado, na mesma ordem, ao projeto Supabase isolado:

- projeto: `acheguese-v2`
- ref: `hnuhabsuzaagsjrtyzdo`

## Regras

- Não criar SQL de schema paralelo em `infra/postgres`.
- Toda alteração de banco nasce como migration.
- Depois de DDL: validar security e performance advisors.
- Regenerar tipos TypeScript quando o schema público mudar.
- Não aplicar migrations no projeto legado `acheguese`.
