# Deployment Receipt — FASE 4 candidate source-aligned — 2026-09-09

Data: 2026-09-09  
Repositório: `washingtonmsdj/teste-acheguese`  
Projeto Vercel: `teste-acheguese`

> A autoridade de sequência continua sendo `/URGENTE.md`.

## 1. Candidate canônico atual

- source/runtime: `339f32ec3c833e3cef626eaaa490d7446cb410bb`;
- deployment: `dpl_5d2ZrM9YtEL4ZvA9BBVkmBEK14Gy`;
- URL protegida: `https://teste-acheguese-qqq4dlckw-jogo-brasils-projects.vercel.app`;
- target: preview;
- state: **READY**;
- region: `iad1`;
- Next.js: `16.3.4`;
- Node: `24.x`;
- quality: `34314538619` **PASS**;
- vercel-source-bundle: `34314538512` **PASS**;
- `deploy/vercel-bundle/SOURCE_SHA`: exatamente `339f32ec3c833e3cef626eaaa490d7446cb410bb`.

## 2. Provenance e configuração pública

O deployment foi criado a partir do `vercel-files.json` canônico produzido pelo workflow e recebeu somente um `.env.production` **efêmero, não versionado**, conforme o protocolo já aprovado em `docs/RUNBOOK-TERRITORY-RELEASE.md`.

O arquivo efêmero contém somente:

- `NEXT_PUBLIC_SITE_URL=https://teste-acheguese.vercel.app`;
- `NEXT_PUBLIC_SUPABASE_URL` do projeto canônico `acheguese-v2`;
- a publishable key moderna ativa do mesmo projeto.

Nenhum secret, `service_role` ou chave server-side foi usado ou versionado.

O prebuild comprovou:

```text
[acheguese] public_env=PASS mode=production required=yes supabase=configured
```

Tentativas de passar `env/buildEnv` diretamente pelo conector de deployment não propagaram as variáveis ao processo de build e foram rejeitadas pelo preflight fail-closed. Não repetir esse caminho enquanto a integração Vercel não oferecer gestão/propagação de Environment Variables.

## 3. Build

- 142 arquivos no payload, contando o `.env.production` efêmero;
- dependências: PASS;
- prebuild env fail-closed: PASS;
- Next compile: PASS;
- TypeScript: PASS;
- static generation: **12/12 PASS**;
- outputs/deployment: PASS;
- deployment: **READY**.

O warning conhecido de `unrs-resolver@1.12.2` permanece dev-only e não autoriza aprovação cega de install script.

## 4. Runtime e segurança

- runtime errors observados na janela pós-deploy: **0**;
- Supabase security advisors: **0 lints**;
- nenhuma mutation de schema, RLS ou rollout;
- Deployment Protection/SSO permanece habilitado;
- share-link oficial ainda retorna fluxo SSO 302 quando o cliente não preserva cookie/sessão.

## 5. Mudança de source incluída neste candidate

O candidate inclui o fechamento de navegação ativa do Território Vivo:

- sidebar desktop resolve item ativo pelo `pathname` real;
- bottom navigation mobile usa a mesma autoridade;
- matcher canônico respeita raiz, subrotas e fronteiras de segmento;
- teste impede falso positivo como `/mapa2` para `/mapa`;
- módulos `future` continuam invisíveis.

## 6. Gate ainda pendente

Ainda **não** marcar como PASS:

1. `territory-release-smoke` completo em sessão autenticada persistente;
2. Home Complexo + quatro `?bairro=`;
3. Mapa real, filtros, clustering e deep links em browser;
4. revisão visual 1440×900;
5. revisão visual 390×844;
6. callback Auth exata deste candidate;
7. Auth/Classificados E2E.

## 7. Próxima ação

1. preservar `dpl_5d2ZrM9YtEL4ZvA9BBVkmBEK14Gy`;
2. abrir o preview com sessão Vercel autenticada persistente/cookie jar real;
3. executar smoke completo;
4. executar revisão visual desktop/mobile;
5. revisar runtime após exercitar as rotas;
6. adicionar somente `https://teste-acheguese-qqq4dlckw-jogo-brasils-projects.vercel.app/auth/callback` à allow-list Auth;
7. executar Auth/Classificados E2E;
8. corrigir somente blockers comprovados;
9. fechar FASE 4 somente após todos os gates.

## 8. STOP

- não promover para produção;
- não alterar rollout para público;
- não iniciar Community/Empresas/Gastronomia/Mobilidade;
- não relaxar RLS/CSP/Deployment Protection;
- não adicionar wildcard Vercel ao Auth;
- não versionar `.env.production`;
- não inventar conteúdo para preencher estados vazios.
