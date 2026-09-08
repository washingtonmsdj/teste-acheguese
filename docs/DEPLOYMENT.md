# Deployment

Checkpoint consolidado atual: `docs/PREDEPLOY-RECEIPT-2026-09-07.md`.

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

As rotas públicas desse deployment antigo respondem, mas ele ainda não recebeu as variáveis públicas do `acheguese-v2` e **não contém** Map Core v1 nem a Home territorial atual. Rotas pessoais permanecem fail-closed.

### Source candidato atual

O último HEAD técnico validado antes desta atualização documental é:

`398e39e76203614cb59703ac39a1ad0013a54af1`

Para esse HEAD:

- frontend/source checkpoint: `398e39e76203614cb59703ac39a1ad0013a54af1`;
- quality: **PASS** — run `34180212208`;
- bundle de transporte: **PASS** — run `34180212249`;
- Home, cabeçalho, navegação mobile, Mapa, menu e estados resilientes refinados sem mudança de schema/API/rollout;
- copy pública protegida por contrato contra linguagem de implementação/roadmap;
- Supabase security advisors: **0 lints**;
- migration history Supabase/Git alinhado até `20260907130331_classified_favorites_publication_guard_v1`;
- transport branch sincronizada com o mesmo `SOURCE_SHA`;
- payload auditado com lifecycle script MapLibre presente e 0 `.env`;
- pacote declarado como ESM explicitamente, eliminando reparsing heurístico do Node nos testes;
- login/cadastro/logout/callback protegidos por origem explícita; produção aceita somente a Site URL canônica ou a URL exata do deployment Vercel atual, sem wildcard;
- redirect interno fail-closed contra separators/backslash/controles percent-encoded e dupla codificação no pathname;
- smoke territorial pós-deploy disponível fora do bundle de produção;
- preflight de env pública roda antes de `dev`/`build`, fail-fast para par Supabase incompleto ou URLs inválidas;
- setup local pode ser validado explicitamente com `npm run env:check`;
- usar a publishable key moderna ativa do `acheguese-v2`, não service-role;
- production dependency audit: **0 vulnerabilidades**;
- CSP + HSTS configurados sem nonce;
- Map CSP/Image allowlists derivadas de configuração pública, sem wildcard;
- bucket `classified-media` privado e alinhado ao contrato de upload;
- banco v2 sem usuários/anúncios/conversas fictícios;
- anon RLS smoke real = PASS;
- authenticated/admin RLS smoke real = PASS, rollback-safe e versionado em `supabase/smoke/authenticated-rls.sql`;
- policies/grants de Classificados auditados;
- superfícies pessoais/admin explicitamente dinâmicas e `private, no-store`;
- build route table confirma todas as superfícies protegidas como `ƒ`;
- adapter SSR revisado contra `@supabase/ssr 0.12.6`, com client por request, `getClaims()` e headers privados de refresh preservados.

## Transporte de source

A integração Vercel disponível no ambiente consegue criar deployments por upload de arquivos, mas não expõe importação de repositório Git nem escrita de env vars.

Para preservar a `main` como SSOT, existe o workflow:

`.github/workflows/vercel-source-bundle.yml`

A cada push em `main` ele recria a branch técnica:

`deploy/vercel-bundle`

Essa branch contém apenas:

- `SOURCE_SHA`
- `vercel-files.json`

A source closure é definida por `infra/vercel-source-manifest.json`. O contrato é testado para garantir que scripts locais exigidos por lifecycle npm estejam presentes e que arquivos de ambiente não entrem no payload.

O bundle é derivado automaticamente da `main` e serve somente como transporte para a API de deployment.

## Variáveis públicas exigidas

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Opcionais para trocar o provider/style padrão do mapa:

- `NEXT_PUBLIC_MAP_STYLE_URL`
- `NEXT_PUBLIC_MAP_CSP_ORIGINS` — origens adicionais de tiles/sprites/glyphs, separadas por vírgula

Preparação confirmada em 2026-09-07:

- a URL pública do projeto Supabase v2 está disponível;
- existe uma `sb_publishable_...` ativa;
- o alias Vercel canônico continua `https://teste-acheguese.vercel.app`.

**Não gravar a publishable key em Git nem em documentação.** Ela é pública por natureza, mas deve continuar sendo injetada como configuração de deployment. Nunca usar service-role, secret key ou credencial privada nesse bundle.

## Bloqueio externo atual

A conta Vercel Hobby atingiu o limite de 100 deployments via API no período diário.

Reset informado pela API:

**2026-09-08 03:23:07 America/Bahia**

Até o reset, a Vercel retorna `402 payment_required` para novos API deployments.

O source mais recente já está empacotado; não é necessário alterar arquitetura ou recriar projeto quando a cota voltar.

## Próximo deployment

Antes de criar qualquer candidato, executar em um checkout do HEAD pretendido:

```bash
npm run release:preflight
```

Esse gate falha fechado se o checkout local, a `main`, `deploy/vercel-bundle/SOURCE_SHA`, o workflow `quality` e o workflow `vercel-source-bundle` não estiverem alinhados no mesmo SHA aprovado. `GITHUB_TOKEN` é opcional para autenticação/rate limit e nunca é impresso; `RELEASE_SOURCE_SHA` pode ser usado somente quando o ambiente não possui `.git`.

Usar somente o bundle do HEAD que passou nesse gate e injetar somente as três variáveis públicas acima.

Após READY:

1. executar:
   `BASE_URL=https://<candidato> EXPECT_TERRITORY_PUBLIC=0 node scripts/territory-release-smoke.mjs`;
2. exigir smoke PASS completo;
3. revisar visualmente Home/Mapa em desktop + mobile;
4. validar filtros, clustering, foco e deep links;
5. inspecionar runtime logs/erros;
6. manter Site URL oficial e adicionar somente a redirect exata `https://<candidato>/auth/callback` no Supabase Auth; validar cadastro/login no candidato;
7. executar E2E do vertical Classificados;
8. somente então tratar o alias como candidato de release da fundação territorial.
