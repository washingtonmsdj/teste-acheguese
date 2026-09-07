# Supabase — estado da integração

## Projeto canônico

- Nome: `acheguese-v2`
- Região: `sa-east-1`
- Ref: `hnuhabsuzaagsjrtyzdo`
- Projeto legado `acheguese`: separado e não reutilizado.

## Integração

O código usa:
- `@supabase/supabase-js`
- `@supabase/ssr`
- sessão em cookies;
- `proxy.ts` para refresh;
- `getClaims()` para autorização server-side.

Variáveis exigidas no runtime:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

A publishable key é a única chave pública da aplicação. Secret/service-role nunca entra em `NEXT_PUBLIC_*`.

## Banco

O histórico aplicado está em `supabase/migrations`.

Estado atual:
- cidades;
- categorias;
- classificados;
- mídia;
- favoritos;
- denúncias;
- localização exata em schema privado;
- moderação interna em schema privado;
- workflow de revisão protegido por RLS + trigger de transição.

## Storage

Bucket: `classified-media`
- privado;
- máximo 8 MB por objeto;
- JPG, PNG, WebP e AVIF;
- caminho `<owner-id>/<classified-id>/<uuid>.<ext>`;
- sem overwrite/upsert no fluxo normal;
- leitura pública somente quando o anúncio estiver publicado e a mídia estiver registrada;
- owner pode gerenciar apenas mídia de anúncio editável.

## Segurança

Última validação:
- security advisors: 0 lints;
- funções públicas de review: `SECURITY INVOKER`;
- `anon_execute=false`;
- `authenticated_execute=true`;
- performance advisors exibem apenas índices ainda não usados, esperado em banco sem tráfego.

## Próxima ativação

Criar um projeto Vercel novo para este repositório, configurar as duas variáveis públicas e validar Auth + rascunho + upload no navegador.
