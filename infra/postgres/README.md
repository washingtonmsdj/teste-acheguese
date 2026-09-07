# Postgres / Supabase

Este diretório contém **drafts de arquitetura SQL**. Eles não são migrations aplicadas.

Quando o novo projeto Supabase do Achegue-se for criado:

1. instalar/validar a versão atual do Supabase CLI;
2. criar a migration com `supabase migration new <nome>`;
3. aplicar o draft em ambiente de desenvolvimento;
4. executar testes de RLS e advisors;
5. gerar/ajustar a migration final;
6. só então promover para produção.

O projeto Supabase antigo `acheguese` não deve receber este schema.
