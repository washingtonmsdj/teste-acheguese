# Deployment Receipt — FASE 4 candidate source-aligned

Data: 2026-09-08  
Repositório: `washingtonmsdj/teste-acheguese`  
Projeto Vercel: `teste-acheguese`

> A autoridade de sequência continua sendo `/URGENTE.md`.

## 1. Candidate canônico atual

- deployment: `dpl_GNRwVoH5RyBHFnoRGuTZeBGiwvHh`;
- URL protegida: `https://teste-acheguese-qbmrxtxca-jogo-brasils-projects.vercel.app`;
- target: preview;
- state: **READY**;
- region: `iad1`;
- Next.js: `16.3.4`;
- Node: `24.x`;
- source/runtime: `e82526be3c3ca03861bc352c37f99dd45ad8efd8`;
- quality: `34207533838` PASS;
- vercel-source-bundle: `34195671848` PASS.

Este é o candidate canônico que contém o frontend técnico atual, incluindo account rail, detalhe público refinado e moderação alinhada.

## 2. Provenance e configuração pública

Antes do deployment foi confirmado:

- `main source/runtime = fa1639244fb30908a48fcf974e33f9b7dc14b7fe`;
- `deploy/vercel-bundle/SOURCE_SHA = fa1639244fb30908a48fcf974e33f9b7dc14b7fe`;
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

- 120 deployment files;
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
- Home chegou ao app: `GET / 200`, cache MISS;
- HTML da sessão 200 contém o App Shell Território Vivo, marca pin+heart, sidebar agrupada, toolbar e bottom navigation.

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

Home product-first no source `d148ef3e`:

- mapa vira composição lado a lado a partir de 1180px;
- rollout deixa de ocupar o hero;
- copy e CTAs ficam orientados a tarefa;
- seletor Complexo/bairros permanece canônico;
- dados oficiais, fontes e deep links do mapa são preservados;
- Classificados aparece como utilidade local, sem assumir o eixo do produto.

Escopo MVP explícito no source `abc52b42`:

- Território/Home = MVP;
- Mapa = MVP;
- Classificados = MVP;
- Auth/Favoritos/Mensagens/Meus/Novo/Editar/Moderação = suporte operacional;
- Community/Alertas/Eventos/Oportunidades/Empresas = future;
- Gastronomia/Mobilidade continuam fora do escopo atual;
- navegação ativa exige `releaseScope=mvp` e `availability=active`;
- testes impedem exposição acidental de módulo futuro.

O candidate preserva account rail, loadings contextuais, Auth alinhado, detalhe público refinado e moderação contextual.

## 8. Previews anteriores

Os previews abaixo são históricos e não são o candidate canônico atual:

- `dpl_4j5FXenU3Yanae8np3cE1JjGS16R`;
- `dpl_6iMzFBhrfgs3jfBxJdnMY5wfC76y`;
- `dpl_G5CZ14AZNcAygUjd8VJAhe8wicSv`.

Não usar esses artefatos para aprovar o frontend atual.

## 9. Próxima ação

1. preservar `dpl_GC8UYAX1Rx8ZjiffMkby4TCwofWq`;
2. abrir o preview com sessão Vercel autenticada persistente;
3. executar smoke completo;
4. validar 1440×900 e 390×844;
5. revisar runtime após exercitar as rotas;
6. adicionar somente `https://teste-acheguese-4kprvakec-jogo-brasils-projects.vercel.app/auth/callback` na allow-list Auth;
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
