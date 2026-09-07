# PREDEPLOY Receipt — FASE 4 territorial

Data: 2026-09-07  
Repositório canônico: `washingtonmsdj/teste-acheguese`  
Branch canônica: `main`

> Este receipt é um checkpoint operacional. A autoridade de sequência continua sendo `/URGENTE.md`.

## 1. Linha canônica

- v2 / implementação ativa: `washingtonmsdj/teste-acheguese`;
- legado donor/reference: `washingtonmsdj/acheguese`;
- não criar terceiro repositório;
- não retomar features no original.

## 2. Source / CI

Checkpoint vivo usado para este receipt:

- `main`: `e53c5ed72d2c5960a69fb1e9b4daad7377ad6a0d`;
- quality run: `34155962240` — **PASS**;
- vercel-source-bundle run: `34155962290` — **PASS**;
- deploy transport: `SOURCE_SHA == main HEAD` no momento da prova.

Quality inclui:

- npm ci;
- audit de dependências de produção;
- secret scan da árvore rastreada;
- lint;
- TypeScript;
- node:test;
- next build.

PRs para `main` também executam quality + source-closure validate. Publish do transport branch é restrito à `main`.

## 3. Supabase

Projeto:

- `acheguese-v2`;
- ref: `hnuhabsuzaagsjrtyzdo`;
- região: `sa-east-1`.

Estado:

- security advisors: **0 lints**;
- migrations alinhadas até `20260907130331_classified_favorites_publication_guard_v1`;
- banco transacional sem usuários/anúncios/mensagens fictícios no baseline pré-release.

Smokes canônicos:

- `supabase/smoke/anon-rls.sql` — PASS;
- `supabase/smoke/authenticated-rls.sql` — PASS + rollback sem resíduos;
- `supabase/smoke/grants-contract.sql` — PASS.

Grant contract comprovado:

- `anon`: SELECT-only em tabelas públicas;
- `anon` EXECUTE: apenas as 2 RPCs públicas do mapa;
- `authenticated`: escrita apenas no domínio Classificados;
- `authenticated` EXECUTE: mapa + submit/withdraw de Classificados;
- schema `private`: sem USAGE/CREATE para client roles;
- nenhuma função `SECURITY DEFINER` executável por `anon/authenticated`;
- funções expostas/privilegiadas com `search_path` fechado.

## 4. Rollout

Estado confirmado no banco:

- Complexo do Nordeste de Amaralina: `data_preparation`;
- Chapada do Rio Vermelho: `data_preparation`;
- Nordeste de Amaralina: `data_preparation`;
- Santa Cruz: `data_preparation`;
- Vale das Pedrinhas: `data_preparation`;
- `activated_at = null` para todos.

**Nenhum território foi lançado.**

## 5. Dados oficiais

Territory data probe:

- run: `34155391384`;
- resultado geral: **PASS**.

Censo:

- 4 bairros;
- raw SHA: `6225cada24a06eb8f280ffe9a8da4fe3d6a1e554748bccd15e6fb07c811cf115`;
- normalized SHA: `89b4bcc4d385cee338beb65c43b39d88951a1392a6c2886c89c7ea00fd17a420`;
- idêntico ao snapshot promovido.

Educação:

- 14 unidades;
- 3 / 2 / 8 / 1 por bairro;
- mismatch textual: 8/14;
- normalized SHA: `696604e2528b1608f041651be2fd76dc6de17331f4f37b8f35654a4b5d3c3c02`;
- idêntico ao snapshot promovido.

Saúde SUS / CNES:

- source last modified: `2026-09-05T06:59:02Z`;
- archive SHA: `8908498b9d1ae69ce475dffe1b8259fa7d74b051551660034f0f3501784f337a`;
- 52 estabelecimentos dentro do MVP;
- 6 SUS selecionados;
- 46 não-SUS/privados adiados;
- contagens: Chapada 0 / Nordeste 2 / Santa Cruz 1 / Vale 3;
- normalized SHA: `5ae2db990b81a0655a2abb77a77ec63e1c7349de4f398f9f24ba2bfcdf135098`;
- idêntico ao snapshot promovido.

Decisão da revalidação:

**NO DB MUTATION**  
**NO MIGRATION**  
**NO ROLLOUT CHANGE**

Receipt detalhado: `docs/data/receipts/2026-09-07-territory-source-revalidation.md`.

## 6. Map / Home

Baseline canônico preservado:

- 4 boundaries;
- 20 public places;
- 14 educação;
- 6 saúde SUS;
- MapLibre GL 6.7.0;
- OpenFreeMap provider-agnostic;
- bbox mínimo zoom 10;
- bbox máximo 2°;
- até 10 categorias;
- Home Cache 60s;
- rollout/SEO fail-closed;
- Home/Mapa noindex enquanto rollout não for público.

## 7. Auth / Classificados

Concluído em source/banco:

- Auth SSR;
- login/cadastro/logout/callback com origem explícita confiável;
- candidate Vercel aceita somente sua própria `VERCEL_URL`, nunca wildcard;
- redirects internos fail-closed;
- páginas pessoais/admin `force-dynamic`;
- `private, no-store`;
- RLS;
- Storage privado;
- lifecycle owner/admin;
- moderação com autoridade em `app_metadata`;
- owner não se autopublica;
- admin não modera o próprio anúncio.

Issue ativa: **#2 — FASE 4 — Classificados E2E / release gate**.

## 8. Governança do repositório

Versionado:

- `SECURITY.md`;
- `.github/CODEOWNERS`;
- Dependabot;
- `docs/REPOSITORY-GOVERNANCE.md`;
- PR quality/source-closure gates;
- secret scan de árvore atual.

Issue administrativa:

- **#6 — Governança — habilitar proteção administrativa da main**.

Limite conhecido:

- Rulesets retornou coleção vazia;
- branch protection clássica não pôde ser lida pela integração (403);
- não presumir proteção da `main` até verificação Admin;
- Secret Scanning histórico também deve ser verificado administrativamente antes do lançamento público.

## 9. Vercel

Projeto canônico:

- project ID: `prj_MUONHjTGLsctNJZ7J1BWB8xzMidj`.

Estado atual:

- somente 1 deployment existente;
- deployment antigo: `dpl_4hgED9grfQNbT6DLCrZEUaCqqnWv`;
- ele está READY, mas usa source antigo e **não** representa Territory/Map/Home atuais;
- não tratar esse deployment como candidato de release.

Blocker externo:

- Hobby API deployment quota;
- reset informado: **2026-09-08 03:23:07 America/Bahia**.

## 10. Próxima ação exata

Depois do reset:

1. ler `main` HEAD ao vivo;
2. confirmar `deploy/vercel-bundle/SOURCE_SHA == main HEAD`;
3. confirmar quality PASS;
4. confirmar bundle PASS;
5. confirmar Supabase security advisor sem blocker;
6. confirmar rollout ainda `data_preparation`;
7. criar **um único** deployment candidato;
8. se build falhar, ler logs antes de segunda tentativa;
9. adicionar somente `https://<candidato>/auth/callback` à allow-list do Supabase Auth;
10. executar `territory-release-smoke` com `EXPECT_TERRITORY_PUBLIC=0`;
11. revisar desktop 1440×900;
12. revisar mobile 390×844;
13. revisar logs/runtime;
14. executar Auth/Classificados E2E;
15. corrigir somente blockers comprovados;
16. fechar FASE 4 somente após todos os gates.

## 11. STOP

Não fazer antes desse candidato:

- Community;
- Empresas;
- Gastronomia;
- Mobilidade;
- rename/consolidação dos repositórios;
- merge de Dependabot sem necessidade de release/security;
- relaxamento de RLS/CSP/bbox/category guards;
- publicação de rollout;
- conteúdo fictício para “preencher” UI.

O próximo trabalho que muda produto deve nascer de evidência do deployment real.
