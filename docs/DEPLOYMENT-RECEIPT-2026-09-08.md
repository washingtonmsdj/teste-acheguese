# Deployment Receipt — FASE 4 candidate source-aligned

Data: 2026-09-08  
Repositório: `washingtonmsdj/teste-acheguese`  
Projeto Vercel: `teste-acheguese`

> A autoridade de sequência continua sendo `/URGENTE.md`.

## 1. Candidate canônico atual

- deployment: `dpl_8KEbDJwspWrAoRAgj2bo9mfMrKLV`;
- URL protegida: `https://teste-acheguese-5cv3zyaob-jogo-brasils-projects.vercel.app`;
- target: preview;
- state: **READY**;
- region: `iad1`;
- Next.js: `16.3.4`;
- Node: `24.x`;
- source/runtime: `6bbb24b665f06bf0a1104fdc788e0a494c41e57b`;
- quality: `34213809448` PASS;
- vercel-source-bundle: `34213809447` PASS.

Este candidate contém a Home product-first, Auth/conta/moderação já endurecidos e o fluxo visual estruturado de Novo/Editar anúncio.

## 2. Provenance e configuração pública

Antes do deployment foi confirmado:

- `main source/runtime = 6bbb24b665f06bf0a1104fdc788e0a494c41e57b`;
- `deploy/vercel-bundle/SOURCE_SHA = 6bbb24b665f06bf0a1104fdc788e0a494c41e57b`;
- quality do SHA exato = PASS;
- vercel-source-bundle do SHA exato = PASS;
- bundle sem arquivos `.env` versionados;
- Supabase security advisors = 0 lints;
- rollout Complexo + quatro bairros = `data_preparation`;
- `activated_at = null`.

O payload do deployment recebeu um `.env.production` **efêmero e não versionado** somente com:

- `NEXT_PUBLIC_SITE_URL`;
- `NEXT_PUBLIC_SUPABASE_URL`;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Nenhum secret/service-role foi usado.

O prebuild comprovou:

```text
[acheguese] public_env=PASS mode=production required=yes supabase=configured
```

## 3. Build

Provas do deployment:

- 131 deployment files;
- `npm ci`: PASS;
- audit: 0 vulnerabilities;
- prebuild env fail-closed: PASS;
- Next compile: PASS;
- TypeScript: PASS;
- static generation: 12/12 PASS;
- outputs: PASS;
- deployment: READY.

Rotas principais presentes no build:

- `/`;
- `/api/health`;
- `/api/map/viewport`;
- `/mapa`;
- `/classificados`;
- `/buscar`;
- `/entrar`;
- `/auth/callback`;
- `/auth/signout`;
- `/favoritos`;
- `/mensagens`;
- `/menu`;
- `/robots.txt`;
- `/sitemap.xml`.

Warning não-blocker preservado:

- `unrs-resolver@1.12.2` possui postinstall não aprovado;
- não aprovar install script transitivo às cegas.

## 4. Runtime

- runtime errors observados: **0**;
- o candidate está READY;
- Deployment Protection/SSO intercepta requests sem sessão persistente antes da aplicação;
- portanto não inferir smoke/visual PASS somente pelo build.

## 5. Dados e segurança

Revalidação na mesma rodada:

- 4 boundaries;
- 20 public places verificados;
- 14 Educação;
- 6 Saúde/SUS;
- Supabase security advisors: 0 lints;
- Complexo + quatro bairros: `data_preparation`;
- nenhuma ativação de rollout;
- nenhuma mutation de schema/RLS/rollout.

## 6. Gate ainda incompleto

Deployment Protection/SSO continua ativo.

O cliente Vercel conseguiu uma sessão 200 da Home, mas as chamadas seguintes voltaram a ser interceptadas pelo SSO por não manterem de forma estável o cookie da sessão. O Chromium local disponível nesta execução não possui resolução DNS externa.

Portanto ainda **não** marcar como PASS:

- `territory-release-smoke` completo;
- Home dos quatro `?bairro=`;
- Mapa real/filtros/clustering/deep links em browser;
- `robots.txt` e `sitemap.xml` no candidate;
- revisão visual 1440×900;
- revisão visual 390×844;
- callback Auth exata do candidate;
- Auth/Classificados E2E.

Isso não é evidência de falha do Achegue-se. É um gate não executado por limitação de sessão/ambiente.

## 6A. Correções Auth do checkpoint

- recursão em `requireTrustedAuthOrigin` removida;
- login e cadastro usam a mesma validação de Origin;
- `/entrar` usa `safeInternalPath` e redireciona sessão já autenticada;
- shell usa rótulo neutro “Sua conta”;
- logout usa somente `POST /auth/signout` existente e protegido;
- rail de conta oferece “Sair da conta”;
- Meus anúncios mantém o mesmo logout acessível no mobile;
- testes de regressão cobrem recursão, session-aware gateway e POST de logout.

## 7. Frontend contido

O candidate contém o frontend técnico atual:

- Home product-first com mapa protagonista em 1180px+;
- loading da Home reserva o mesmo rail/breakpoint;
- Busca/Menu/Auth alinhados ao Território Vivo;
- account rail + loadings contextuais;
- detalhe público e moderação contextual;
- Novo/Editar anúncio em seções: conteúdo, preço/condição, descrição e localização;
- Novo anúncio mostra rascunho → fotos → revisão;
- contratos de campos/Server Actions/lifecycle preservados por teste;
- módulos futuros continuam fora do MVP pelo `releaseScope`.

## 8. Previews anteriores

Os previews abaixo são históricos e não são o candidate canônico atual:

- `dpl_4j5FXenU3Yanae8np3cE1JjGS16R`;
- `dpl_6iMzFBhrfgs3jfBxJdnMY5wfC76y`;
- `dpl_G5CZ14AZNcAygUjd8VJAhe8wicSv`.

Não usar esses artefatos para aprovar o frontend atual.

## 9. Próxima ação

1. preservar `dpl_8KEbDJwspWrAoRAgj2bo9mfMrKLV`;
2. abrir o preview com sessão Vercel autenticada persistente;
3. executar smoke completo;
4. validar 1440×900 e 390×844;
5. revisar runtime após exercitar as rotas;
6. adicionar somente `https://teste-acheguese-5cv3zyaob-jogo-brasils-projects.vercel.app/auth/callback` na allow-list Auth;
7. executar Auth/Classificados E2E;
8. corrigir somente blockers observados;
9. fechar FASE 4 somente após todos os gates.

## 10. STOP

Ainda não:

- promover para produção;
- alterar rollout para público;
- iniciar Community;
- iniciar Empresas/Gastronomia/Mobilidade;
- relaxar RLS/CSP/Deployment Protection;
- adicionar wildcard Vercel ao Auth;
- criar novo candidate sem mudança de source/runtime ou blocker real;
- inventar conteúdo para preencher estados vazios.
