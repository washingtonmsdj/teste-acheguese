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

`d28dcc9556f90324123c676e2d05de5c3db87b31`

Para esse HEAD:

- frontend/source checkpoint: `d28dcc9556f90324123c676e2d05de5c3db87b31`;
- quality: **PASS** — run `34189520702`;
- bundle de transporte: **PASS** — run `34189520634`;
- Home, cabeçalho, navegação mobile, Mapa, menu e estados resilientes refinados sem mudança de schema/API/rollout;
- `/mapa` e `/classificados` possuem loading states específicos, responsivos e compatíveis com reduced-motion;
- o App Shell **Território Vivo** é a arquitetura global das superfícies atuais: Home, Mapa, Busca, Classificados público/detalhe e áreas autenticadas/admin do módulo; sidebar/toolbar/rail e registry de módulos futuros estão versionados; o `SiteHeader` standalone foi removido; a bottom navigation é derivada do mesmo registry, sem segunda autoridade; `docs/FRONTEND-TERRITORIO-VIVO.md` é a referência visual canônica;
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

## Candidate atual

Candidate visual canônico:

- deployment: `dpl_8dmirY6fshiZg6EuAr55PGCwii1S`;
- URL: `https://teste-acheguese-6riiqf8vv-jogo-brasils-projects.vercel.app`;
- state: **READY**;
- source/runtime: `85df68f43479aa6b25d8d8613bfd66a29809950c`;
- quality: `34201520319` PASS;
- source bundle: `34201520421` PASS;
- build Vercel: `required=yes supabase=configured`;
- compile/TypeScript/static generation: PASS;
- runtime errors: **0**;
- Home: `GET / 200`;
- área pessoal e moderação usam rails contextuais;
- CSS Auth legado removido;
- detalhe público de Classificados refinado;
- Deployment Protection/SSO permanece habilitada.

Os previews anteriores são históricos e não substituem esse candidate.

## Próximo deployment

**Não criar novo candidate por padrão.** O deployment atual já representa o HEAD técnico `bab5273b1c6b757cbd3d0b583416f6c441e533ef`.

Criar outro somente quando houver mudança de source/runtime ou correção motivada por defeito comprovado. Nesse caso, antes de criar o candidato executar em um checkout do HEAD pretendido:

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


## Gate visual obrigatório

Validar o candidato real antes de fechar a FASE 4 em pelo menos:

- desktop: **1440×900**;
- mobile: **390×844**.

Conferir Home, Mapa, Classificados, Busca e estados de loading/erro. Verificar sidebar/toolbar/rail, hero + mapa, overflow, hierarquia, foco/teclado, reduced motion, bottom navigation e ausência de layout shift perceptível.

A aprovação visual deve usar o deployment candidato contendo o HEAD atual; source/CSS sozinho não prova fidelidade final.
