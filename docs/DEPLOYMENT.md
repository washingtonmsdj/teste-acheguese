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

O último HEAD técnico validado é:

`6bbb24b665f06bf0a1104fdc788e0a494c41e57b`

Para esse HEAD:

- quality: **PASS** — run `34213809448`;
- bundle de transporte: **PASS** — run `34213809447`;
- `deploy/vercel-bundle/SOURCE_SHA` alinhado ao mesmo SHA;
- Home product-first e loading com breakpoint/rail alinhados;
- Auth session-aware, logout POST canônico e Origin fail-closed;
- account rail/loadings/moderação/detalhe público preservados;
- Novo/Editar anúncio agrupam o formulário em seções sem alterar nomes de campos, actions ou lifecycle;
- produção continua fail-closed para configuração pública incompleta;
- Supabase/RLS/schema/rollout não foram alterados por este checkpoint.

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

- deployment: `dpl_8KEbDJwspWrAoRAgj2bo9mfMrKLV`;
- URL: `https://teste-acheguese-5cv3zyaob-jogo-brasils-projects.vercel.app`;
- state: **READY**;
- source/runtime: `6bbb24b665f06bf0a1104fdc788e0a494c41e57b`;
- quality: `34213809448` PASS;
- source bundle: `34213809447` PASS;
- build Vercel: `required=yes supabase=configured`;
- compile/TypeScript/static generation: PASS;
- runtime errors: **0**;
- Home product-first + loading alinhado;
- Auth/conta/moderação/detalhe público preservados;
- Novo/Editar anúncio usam fluxo visual de produto;
- Deployment Protection/SSO permanece habilitada.

Os previews anteriores são históricos e não substituem esse candidate.

## Próximo deployment

**Não criar novo candidate por padrão.** O deployment atual já representa o HEAD técnico `6bbb24b665f06bf0a1104fdc788e0a494c41e57b`.

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
