# Runbook — Release da Fundação Territorial

> **Autoridade de sequência:** `/URGENTE.md`  
> **Escopo:** primeiro deployment com Territory Core + Data Platform + Map Core v1 + Home Territorial.  
> **Não abre Community, Empresas, Gastronomia ou Mobilidade por si só.**

## 1. Fontes canônicas

- código: `main`;
- banco: Supabase `acheguese-v2` (`hnuhabsuzaagsjrtyzdo`);
- deployment: Vercel `teste-acheguese` (`prj_MUONHjTGLsctNJZ7J1BWB8xzMidj`);
- transporte: branch técnica `deploy/vercel-bundle`;
- rollout: `territory_rollout_catalog`;
- plano: `/URGENTE.md`.

O projeto legado `acheguese` não participa deste release.

## 2. Gates obrigatórios antes do deployment

Antes dos gates de CI, a própria source executa `scripts/validate-public-env.mjs` em `prebuild`. Quando as envs públicas forem injetadas no candidato, qualquer par Supabase incompleto ou URL pública inválida deve bloquear o build com erro explícito.

O candidato só pode ser publicado quando:

1. `main` está no HEAD esperado;
2. workflow `quality` = PASS;
3. workflow `vercel-source-bundle` = PASS;
4. `deploy/vercel-bundle/SOURCE_SHA` = HEAD da `main`;
5. Supabase security advisors = 0 lints;
6. migration history remoto e `supabase/migrations/**` estão alinhados;
7. smoke público do Map Core retorna os quatro boundaries e os 20 locais do baseline atual;
8. bundle contém `scripts/copy-maplibre-worker.mjs`;
9. bundle não contém `.env`, secret key ou service-role;
10. auditoria de CSS global não encontra seletores órfãos conhecidos da antiga landing/marketplace;
11. health contract está preparado para provar Territory + Classificados;
12. `npm audit --omit=dev --audit-level=high` = PASS;
13. bucket `classified-media` = privado, 8 MB, MIME allowlist correta;
14. banco v2 não contém conteúdo transacional fictício antes do primeiro release;
15. `supabase/smoke/anon-rls.sql` = PASS no projeto real;
16. `supabase/smoke/authenticated-rls.sql` = PASS no projeto real e termina sem resíduos;
17. `supabase/smoke/grants-contract.sql` = PASS no projeto real;
18. migration history termina em `20260907130331_classified_favorites_publication_guard_v1`;
19. páginas pessoais/admin aparecem como `ƒ` no build;
20. `/entrar` e demais superfícies protegidas retornam `Cache-Control` com `private` + `no-store`.

O performance advisor pode reportar `unused_index` em nível INFO enquanto não existe tráfego real. Não remover índices com base apenas nessa ausência de amostra.

## 3. Configuração pública do candidato

Injetar no deployment, sem commit:

- `NEXT_PUBLIC_SITE_URL=https://teste-acheguese.vercel.app`;
- `NEXT_PUBLIC_SUPABASE_URL=https://hnuhabsuzaagsjrtyzdo.supabase.co`;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key ativa do acheguese-v2>`.

Com o OpenFreeMap padrão, nenhuma variável adicional de mapa é necessária. Se um provedor/style customizado for usado:

- `NEXT_PUBLIC_MAP_STYLE_URL=<style http(s)>`;
- `NEXT_PUBLIC_MAP_CSP_ORIGINS=<origens adicionais separadas por vírgula>` para tiles/sprites/glyphs que estejam fora da origem do style.

A CSP deriva automaticamente a origem do style e mantém allowlist explícita; não usar wildcard.

Nunca incluir:

- service-role;
- `sb_secret_...`;
- senha;
- token administrativo;
- credencial privada.

A publishable key é configuração pública, mas continua fora do Git para manter um único mecanismo operacional de configuração.

## 4. Criar um único deployment candidato

Após a cota Vercel estar disponível:

1. ler `SOURCE_SHA`;
2. confirmar igualdade com `main`;
3. carregar `vercel-files.json`;
4. acrescentar as três variáveis públicas somente no payload/ambiente do deployment;
5. criar **um** deployment candidato;
6. não criar deployments paralelos para “testar tentativa”;
7. aguardar `READY`;
8. registrar deployment ID e URL.

Depois que a URL única do candidato existir, preparar Auth **antes do E2E**:

- manter a Site URL do Supabase na URL oficial `https://teste-acheguese.vercel.app`;
- adicionar **exatamente** `https://<url-do-candidato>/auth/callback` em Redirect URLs;
- não usar wildcard `*.vercel.app`;
- o runtime aceita somente a Site URL canônica ou a própria `VERCEL_URL` do deployment atual;
- se houver template de e-mail customizado, confirmar que ele respeita o `RedirectTo` informado pelo signup;
- após promoção/encerramento do candidato, remover a redirect URL temporária se ela não for mais necessária.

Se o build falhar, inspecionar build logs antes de qualquer segundo deploy.

## 5. Smoke automatizado + health

Assim que o deployment estiver `READY`, executar do checkout da mesma `main`:

```bash
BASE_URL=https://<url-do-candidato> \
EXPECT_TERRITORY_PUBLIC=0 \
node scripts/territory-release-smoke.mjs
```

Enquanto o rollout estiver em `data_preparation`, usar `EXPECT_TERRITORY_PUBLIC=0`. Quando o grupo for promovido no futuro, o mesmo smoke aceita `1`.

### 5.0 Preview protegido — caminho canônico de automação

Para candidate protegido por Vercel Authentication/Deployment Protection, **não usar share-link como mecanismo de CI**. Gerar o **Protection Bypass for Automation** no projeto Vercel e armazenar o mesmo valor como secret do repositório GitHub com o nome:

`VERCEL_AUTOMATION_BYPASS_SECRET`

O segredo:

- nunca entra em `.env`, source, log, issue ou artifact;
- é enviado somente via header `x-vercel-protection-bypass`;
- só pode ser usado contra host HTTPS do projeto Vercel canônico;
- não substitui nem desativa Deployment Protection.

Workflow canônico:

`.github/workflows/protected-release-smoke.yml`

Execução manual:

1. Actions → **protected-release-smoke** → Run workflow;
2. informar a URL exata do candidate em `base_url`;
3. manter `expect_territory_public=0` enquanto o rollout estiver em `data_preparation`;
4. exigir PASS completo antes da revisão visual.

O workflow é `workflow_dispatch` apenas, `contents: read`, checkout sem credencial persistente e falha fechado se o secret não existir. O smoke preserva headers próprios (incluindo `Origin`) ao anexar o bypass.

O smoke automatiza:

- health + headers;
- robots/sitemap;
- Home Complexo + quatro bairros;
- noindex/index conforme rollout;
- redirects de bairro inválido;
- Map API 4/20/14/6;
- guards de bbox/categorias;
- proteção de origem do signout;
- reconhecimento da URL exata do deployment atual como origem Auth confiável.

Falha do smoke é blocker antes da inspeção visual.

### 5.1 `GET /api/health`

Esperado:

- HTTP 200;
- `status = ok`;
- `database = ok`;
- `territory = ok`;
- `classifieds = ok`.

HTTP 503 é blocker. O health atual prova tanto o canário territorial quanto o canário de Classificados; não considera apenas a tabela legada `cities`.

### 5.2 Headers

Confirmar:

- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `X-Frame-Options: DENY`;
- ausência de `X-Powered-By`;
- `Content-Security-Policy` com `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'` e origens de mapa/Supabase esperadas;
- `Strict-Transport-Security: max-age=31536000` no candidato HTTPS;
- `Cache-Control` com `private, no-store` em Auth/admin/páginas pessoais;
- `/api/map/viewport` continua usando cache público próprio e não herda a política privada.

## 6. Rollout e SEO fail-closed

Antes de mudar qualquer rollout, confirmar no banco:

- Complexo = `data_preparation`;
- Nordeste de Amaralina = `data_preparation`;
- Santa Cruz = `data_preparation`;
- Vale das Pedrinhas = `data_preparation`;
- Chapada do Rio Vermelho = `data_preparation`.

Enquanto o grupo estiver em `data_preparation`:

- Home deve permanecer `noindex`;
- `/mapa` deve permanecer `noindex`;
- Home/Mapa não devem entrar no sitemap territorial;
- Classificados mantém sua política própria de indexação.

Publicar o deployment técnico **não altera rollout**.

## 7. Smoke funcional da Home

Validar:

1. `/` — Complexo;
2. `/?bairro=nordeste-de-amaralina`;
3. `/?bairro=santa-cruz`;
4. `/?bairro=vale-das-pedrinhas`;
5. `/?bairro=chapada-do-rio-vermelho`.

Em cada escopo confirmar:

- nome territorial correto;
- população/domicílios quando aplicável;
- contagem de Educação;
- contagem de Saúde SUS;
- mini-mapa;
- provenance;
- link Home → Mapa preservando contexto;
- nenhum post, avaliação, empresa, alerta ou evento fictício.

Também provar:

- `?bairro=../admin` não é aceito;
- slug sintaticamente válido mas fora do TerritoryGroup volta ao escopo canônico.

## 8. Smoke funcional do Map Core

Validar `/mapa` em desktop e mobile:

- 4 boundaries no recorte do Complexo;
- 14 escolas;
- 6 unidades SUS;
- filtros Educação/Saúde;
- clustering;
- clique/tap em ponto;
- lista textual;
- lista → focalizar no mapa;
- URL state/deep link;
- reload preservando bbox/zoom/categorias;
- reduced motion;
- mapa antes da lista no mobile.

### Guard de abuso

O contrato local do Map Core v1 exige:

- zoom raw >= 10;
- bbox com span máximo de 2° em longitude e latitude;
- máximo de 10 category keys;
- category key no padrão `^[a-z0-9_]{1,64}$`.

Esses guards existem no Core/API **e nas RPCs públicas PostGIS**. Não relaxar somente para fazer um deep link inválido funcionar.

## 9. Revisão visual

Executar inspeção real de Surface, não apenas HTML/source.

### Desktop

Verificar no mínimo:

- 1440×900;
- hierarquia da Home;
- mapa sem overflow;
- seletor de bairro;
- cards de métricas;
- provenance;
- header/footer;
- foco por teclado;
- nenhuma área marketplace-first reapareceu.

### Mobile

Verificar no mínimo:

- 390×844;
- navegação inferior;
- mapa antes da lista;
- filtros utilizáveis;
- cards sem corte horizontal;
- seletor territorial rolável;
- CTAs e foco acessíveis.

Registrar screenshots/evidência visual do candidato aprovado.

## 10. Observabilidade

Após os smokes:

1. consultar runtime errors do deployment;
2. consultar logs server-side;
3. procurar eventos `[acheguese]`;
4. confirmar ausência de falhas repetidas em:
   - `territory.home.load_failed`;
   - `territory.map.initial_load_failed`;
   - `territory.map.viewport_api_failed`;
   - `health.territory_canary_failed`;
   - `health.classifieds_canary_failed`;
   - `territory.rollout.read_failed`;
   - `territory.rollout.group_missing`.

Os eventos são redigidos e não devem carregar stack, JWT, Supabase key ou contexto arbitrário.

## 11. Correção e revalidação

Se qualquer blocker aparecer:

1. não promover rollout;
2. corrigir na `main`;
3. executar lint + TypeScript + testes + build;
4. confirmar bundle;
5. confirmar security advisors;
6. gerar novo candidato somente depois de entender a causa;
7. repetir os smokes afetados.

## 12. Rollback

Se o deployment novo estiver `READY` mas tiver regressão de runtime/visual:

1. preservar banco e migrations;
2. reativar o último deployment saudável;
3. não fazer rollback destrutivo de migration sem análise;
4. registrar HEAD, deployment ID, migration version e sintoma;
5. corrigir na `main`.

## 13. Definition of Done da FASE 4

A FASE 4 pode ser marcada release-validada somente quando:

- deployment candidato está `READY`;
- health = 200;
- Home Complexo + quatro bairros passaram;
- Map Core passou;
- desktop/mobile passaram revisão visual;
- SEO/rollout fail-closed foi provado;
- runtime logs sem blocker;
- security advisors = 0;
- quality + bundle = PASS;
- `URGENTE.md` foi atualizado com o HEAD e deployment aprovados.

Somente depois disso o `URGENTE.md` pode avaliar a abertura da FASE 5 — Community.
