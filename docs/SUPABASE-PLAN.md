# Supabase — plano de integração

## Estado

O novo Achegue-se **ainda não está conectado a um projeto Supabase**.

Existe um projeto antigo chamado `acheguese` na conta. Ele não será reutilizado ou modificado por esta reconstrução.

## Estratégia

Quando chegar a hora de conectar o backend:

1. criar um novo projeto Supabase dedicado;
2. usar região compatível com o público inicial;
3. instalar versões pinadas de `@supabase/supabase-js` e `@supabase/ssr`;
4. gerar e commitar lockfile;
5. configurar:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
6. usar `@supabase/ssr` para sessões em cookies no Next.js;
7. usar `proxy.ts` para refresh de sessão;
8. em servidor, proteger acesso com `supabase.auth.getClaims()`, não confiar em `getSession()`;
9. aplicar schema somente por migration criada pelo Supabase CLI;
10. executar testes de RLS + security/performance advisors.

## Chaves

O frontend recebe somente a **publishable key**.

Nenhuma secret key ou `service_role` deve ser exposta em variável `NEXT_PUBLIC_*`.

## Dados

O primeiro schema é descrito em:

`infra/postgres/classifieds-v1.sql`

Esse arquivo é draft. Não é migration.

## Storage

Fotos de Classificados devem ficar em bucket privado até a estratégia de entrega pública ser fechada.

Formato planejado de chave:

`<owner-id>/<classified-id>/<media-id>.<ext>`

Uploads devem validar MIME, tamanho, quantidade e ownership. Não usar `upsert` no fluxo normal.

## Segurança

- RLS em todas as tabelas expostas.
- Grants mínimos.
- Policies separadas para SELECT / INSERT / UPDATE / DELETE.
- UPDATE sempre com `USING` e `WITH CHECK`.
- autorização nunca baseada em `user_metadata`.
- localização exata fica em schema privado.
- notas internas de moderação ficam em schema privado.
