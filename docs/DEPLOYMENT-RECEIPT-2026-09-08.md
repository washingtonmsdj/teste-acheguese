# Deployment Receipt — FASE 4 candidate 1

Data: 2026-09-08  
Repositório: `washingtonmsdj/teste-acheguese`  
Projeto Vercel: `teste-acheguese`

> A autoridade de sequência continua sendo `/URGENTE.md`.

## 1. Candidate 1

Deployment:

- id: `dpl_4j5FXenU3Yanae8np3cE1JjGS16R`;
- URL: `https://teste-acheguese-gi4o7hjpa-jogo-brasils-projects.vercel.app`;
- target: preview;
- state: **READY**;
- region: `iad1`;
- Next.js: `16.3.4`;
- Node: `24.x`;
- source/bundle usado: `e1c71391f8220354de582d9cbe4fe8fc1e4e7846`;
- frontend técnico contido: `a74679aac8b2e6d52ad853044ef6e2e4ac873644`.

Esse foi o primeiro deployment criado após o reset da cota Hobby.

## 2. Configuração pública do candidate

O payload canônico do transport branch foi usado e recebeu, **somente dentro da requisição de deployment**, um `.env.production` efêmero com:

- `NEXT_PUBLIC_SITE_URL`;
- `NEXT_PUBLIC_SUPABASE_URL`;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Nenhum secret/service-role foi usado ou gravado no Git.

Build log comprovou:

```text
[acheguese] public_env=PASS mode=production supabase=configured
```

O build também confirmou todas as rotas App Router esperadas e terminou com deployment READY.

A Vercel emitiu warning recomendando o mecanismo nativo de env por ter detectado o arquivo efêmero. Isso não é erro de build. Para lançamento definitivo, preferir env vars do próprio projeto Vercel quando a integração/administração permitir.

## 3. Provas executadas

### Build

- download: 120 deployment files;
- install: PASS;
- prebuild env: PASS;
- Next compile: PASS;
- TypeScript: PASS;
- static generation: PASS;
- deploy outputs: PASS;
- deployment: READY.

Warning conhecido e não-blocker:

- `unrs-resolver@1.12.2` postinstall não aprovado;
- cadeia já classificada como dev-only;
- não aprovar install script às cegas.

### Health/runtime

`GET /api/health` no candidate retornou HTTP 200:

- `status=ok`;
- `database=ok`;
- `territory=ok`;
- `classifieds=ok`.

Headers comprovados:

- CSP canônica;
- HSTS `max-age=31536000`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy`;
- sem `X-Powered-By`;
- `X-Robots-Tag: noindex`.

Runtime observability do deployment:

- runtime errors: **0**;
- invocação observada no app: `GET /api/health 200`.

## 4. Smoke incompleto por Deployment Protection

O preview está protegido por Vercel SSO/Deployment Protection.

As tentativas automatizadas de acessar:

- Home;
- quatro bairros;
- Mapa;
- robots;
- sitemap;
- Map API;
- Auth signout;

foram interceptadas pela camada SSO **antes de chegar à aplicação**.

O conector gerou shareable URL temporária oficial, porém o cliente de fetch disponível não preserva o cookie necessário após o redirect SSO. O ambiente Chromium local também não possui DNS externo.

Portanto:

- isso **não é falha do Achegue-se**;
- não desativar proteção apenas para satisfazer a ferramenta;
- não marcar o `territory-release-smoke` como PASS;
- não marcar a revisão visual como PASS;
- não promover o candidate às cegas.

## 5. Frontend contido no candidate

O candidate contém o checkpoint frontend `a74679aa`:

- App Shell Território Vivo;
- sidebar + toolbar + rail contextual;
- hero + mini-mapa lado a lado a partir de 1360px;
- bloco de dados públicos em alto contraste;
- Home orientada por território/utilidade;
- Mapa refinado;
- Classificados integrado ao shell;
- mobile navigation derivada do registry;
- módulos futuros permanecem ocultos.

Gate visual ainda obrigatório:

- desktop 1440×900;
- mobile 390×844.

## 6. Main avançou após o candidate

Após a criação do candidate, a `main` avançou para:

`f7fe20806ff3a1f53ba5c4a2d432635bbcdbbb9e`

Mudanças posteriores ao candidate:

- `0a2848e2`: builds Vercel/release agora exigem configuração pública completa;
- Vercel sem Supabase/Site URL falha fechado;
- `f7fe2080`: alvos de toque principais do frontend normalizados para ~44px+;
- quality PASS;
- vercel-source-bundle PASS;
- `SOURCE_SHA` sincronizado.

O candidate 1 **não contém esse commit posterior**.

Consequência:

- candidate 1 é evidência válida de build/frontend/env/health;
- ele não deve ser tratado como artefato final da `main`;
- não criar candidate 2 enquanto o blocker de visual/smoke continuar sendo apenas acesso SSO da ferramenta;
- quando houver caminho para executar o gate completo, usar o HEAD vivo alinhado ao `SOURCE_SHA`.

## 7. Rollout

Durante a criação do candidate:

- Complexo + quatro bairros continuavam em `data_preparation`;
- `activated_at = null`;
- nenhum rollout foi publicado.

## 8. Próxima ação

1. preservar candidate 1 para inspeção manual/protegida;
2. obter caminho autenticado que preserve sessão SSO para smoke/visual, ou executar inspeção manual pelo owner;
3. rodar `territory-release-smoke` completo;
4. validar 1440×900 e 390×844;
5. revisar runtime após as rotas reais serem exercitadas;
6. configurar callback exato do candidate no Supabase Auth para E2E;
7. executar Auth/Classificados E2E;
8. somente depois decidir sobre novo candidate/promote.

## 9. STOP

Ainda não:

- promover para produção;
- lançar rollout;
- iniciar Community;
- iniciar Empresas/Gastronomia/Mobilidade;
- mesclar Dependabot sem blocker;
- desligar RLS/CSP/Deployment Protection por conveniência de teste.
