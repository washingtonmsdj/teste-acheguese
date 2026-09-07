# Deployment

## Vercel canônico

Projeto isolado criado para a reconstrução:

- projeto: `teste-acheguese`
- project id: `prj_MUONHjTGLsctNJZ7J1BWB8xzMidj`
- team: `team_VPZxAK2VXdTWXI8blJaKQEl0`
- alias técnico: `https://teste-acheguese.vercel.app`

O projeto Vercel legado `acheguese` permanece separado.

## Estado atual

Primeiro deployment criado:

- deployment: `dpl_4hgED9grfQNbT6DLCrZEUaCqqnWv`
- estado: READY
- framework: Next.js
- Node: 24.x
- source usado: HEAD `68deb8a44dd12272092e9d80c583a5ffe12c7f6e`

Esse deployment é apenas um preview técnico e **não é o lançamento do MVP**.

As rotas públicas respondem, mas o deployment ainda não recebeu as variáveis públicas do `acheguese-v2`. Rotas pessoais permanecem fail-closed.

## Transporte de source

A integração Vercel disponível no ambiente consegue criar deployments por upload de arquivos, mas não expõe importação de repositório Git nem escrita de env vars.

Para preservar a `main` como SSOT, existe o workflow:

`.github/workflows/vercel-source-bundle.yml`

A cada push em `main` ele recria a branch técnica:

`deploy/vercel-bundle`

Essa branch contém apenas:

- `SOURCE_SHA`
- `vercel-files.json`

O bundle é derivado automaticamente da `main` e serve somente como transporte para a API de deployment.

## Variáveis públicas exigidas

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Não usar service-role, secret key ou qualquer credencial privada nesse bundle.

## Bloqueio externo atual

A conta Vercel Hobby atingiu o limite de 100 deployments via API no período diário.

Reset informado pela API:

**2026-09-08 03:23:07 America/Bahia**

Até o reset, a Vercel retorna `402 payment_required` para novos API deployments.

O source mais recente já está empacotado; não é necessário alterar arquitetura ou recriar projeto quando a cota voltar.

## Próximo deployment

Usar o bundle do HEAD mais recente e injetar somente as três variáveis públicas acima.

Após READY:

1. validar `/api/health`;
2. validar `/robots.txt` e `/sitemap.xml`;
3. validar cadastro/login;
4. configurar Site URL/redirect allow-list do Supabase Auth;
5. executar E2E do vertical Classificados;
6. só então tratar o alias como candidato a MVP.
