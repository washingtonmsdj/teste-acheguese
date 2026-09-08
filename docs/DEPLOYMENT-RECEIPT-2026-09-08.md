# Deployment Receipt — FASE 4 candidate source-aligned

Data: 2026-09-08  
Repositório: `washingtonmsdj/teste-acheguese`  
Projeto Vercel: `teste-acheguese`

> A autoridade de sequência continua sendo `/URGENTE.md`.

## 1. Candidate canônico atual

- deployment: `dpl_ArimT6VmREHKg4cw4jMB91hLBge8`;
- URL protegida: `https://teste-acheguese-a9khog5x3-jogo-brasils-projects.vercel.app`;
- target: preview;
- state: **READY**;
- region: `iad1`;
- Next.js: `16.3.4`;
- Node: `24.x`;
- source/runtime: `af74240985c43cabd0588328ae51d19d5c921ec5`;
- quality: `34265916188` PASS;
- vercel-source-bundle: `34265916232` PASS.

## 2. Provenance e configuração pública

Antes do deployment foi confirmado:

- `main = 47cdaa84296f68264df905aebf5116bc20d821ac`;
- `deploy/vercel-bundle/SOURCE_SHA = 47cdaa84296f68264df905aebf5116bc20d821ac`;
- quality do SHA exato = PASS;
- vercel-source-bundle do SHA exato = PASS;
- bundle sem arquivos `.env` versionados;
- nenhuma mudança de schema/RLS/rollout nesta atualização de frontend.

O payload do deployment recebeu `.env.production` efêmero e não versionado somente com `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Nenhum secret/service-role foi usado.

O prebuild comprovou:

```text
[acheguese] public_env=PASS mode=production required=yes supabase=configured
```

## 3. Build

- 139 deployment files;
- `npm ci`: PASS;
- audit: 0 vulnerabilidades;
- prebuild env fail-closed: PASS;
- Next compile: PASS;
- TypeScript: PASS;
- static generation: 12/12 PASS;
- outputs: PASS;
- deployment: READY.

## 4. Runtime

- runtime errors observados: **0**;
- Classificados chegou ao app com HTTP 200;
- resposta contém App Shell Território Vivo, sidebar/toolbar/rail e bottom navigation;
- Mapa/Classificados/Auth continuam sujeitos à Deployment Protection/SSO quando o cliente não preserva a sessão.
## 5. Frontend contido

Checkpoint técnico: `af74240985c43cabd0588328ae51d19d5c921ec5`.

- Território Vivo/App Shell preservados;
- Classificados usa ícones SVG na camada de UI, sem apresentação no domínio;
- categorias mostram descrições e usam composição mobile em lista de uma coluna;
- estado vazio preserva query + categoria e oferece limpar/ampliar filtros;
- `AccountSurfaceLoading` permanece a única autoridade de loading contextual;
- duplicação `AccountAreaLoading` removida antes do candidate;
- nenhuma feature `future`, schema, RLS ou rollout foi alterado.

## 6. Gate ainda incompleto

Deployment Protection/SSO continua ativo. Ainda **não** marcar como PASS:

- `territory-release-smoke` completo;
- Home dos quatro `?bairro=`;
- Mapa real/filtros/clustering/deep links em browser;
- revisão visual 1440×900;
- revisão visual 390×844;
- callback Auth exata do candidate;
- Auth/Classificados E2E.

Isso não é evidência de falha do Achegue-se. É um gate ainda não executado com sessão persistente.

## 7. Próxima ação

1. preservar `dpl_ArimT6VmREHKg4cw4jMB91hLBge8`;
2. abrir o preview com sessão Vercel autenticada persistente;
3. executar smoke completo;
4. validar 1440×900 e 390×844;
5. revisar runtime após exercitar as rotas;
6. adicionar somente `https://teste-acheguese-a9khog5x3-jogo-brasils-projects.vercel.app/auth/callback` na allow-list Auth;
7. executar Auth/Classificados E2E;
8. corrigir somente blockers observados;
9. fechar FASE 4 somente após todos os gates.

## 8. STOP

- não promover para produção;
- não alterar rollout para público;
- não iniciar Community/Empresas/Gastronomia/Mobilidade;
- não relaxar RLS/CSP/Deployment Protection;
- não adicionar wildcard Vercel ao Auth;
- não inventar conteúdo para preencher estados vazios.
