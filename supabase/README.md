# Supabase

O banco canônico do novo Achegue-se é o projeto isolado `acheguese-v2`.

As migrations em `supabase/migrations` espelham o histórico aplicado no Supabase, na mesma ordem e com os mesmos nomes.

## Regras

- Não reutilizar nem aplicar estas migrations no projeto legado `acheguese`.
- Toda mudança DDL nova deve nascer como migration.
- Depois de DDL: rodar security + performance advisors.
- Tipos TypeScript devem ser regenerados após mudanças no schema.
- Chaves secret/service-role nunca entram no repositório.
