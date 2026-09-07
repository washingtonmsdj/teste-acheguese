# Roadmap de execução — Territory-first

> A autoridade completa é `/URGENTE.md`.
> Este arquivo é um resumo operacional por fase.

## FASE 0 — Saneamento arquitetural — CONCLUÍDA

- [x] arquitetura atual auditada;
- [x] estrutura `core/data/modules/shared` definida;
- [x] Classificados movido para `src/modules/classifieds`;
- [x] ADR Territory-first;
- [x] Architecture Map;
- [x] guardrails de dependência no ESLint;
- [x] README/arquitetura alinhados;
- [x] novos módulos congelados.

## FASE 1 — Territory Core — CONCLUÍDA

- [x] PostGIS 3.3.7;
- [x] `territories`;
- [x] country/state/city/neighborhood;
- [x] `territory_groups`;
- [x] `territory_group_members`;
- [x] `territory_boundaries`;
- [x] índices GiST;
- [x] RLS/grants;
- [x] Brasil → Bahia → Salvador;
- [x] Nordeste de Amaralina;
- [x] Santa Cruz;
- [x] Vale das Pedrinhas;
- [x] Chapada do Rio Vermelho;
- [x] TerritoryGroup do Complexo;
- [x] quatro boundaries oficiais do GeoSalvador;
- [x] catálogo map-ready em GeoJSON;
- [x] contracts/ports TypeScript;
- [x] smoke público/RLS;
- [x] contrato de readiness formalizado;
- [x] rollout/ativação territorial fail-closed.

## FASE 2 — Territory Data Platform — BASELINE MVP CONCLUÍDA

- [x] `data_sources`;
- [x] provenance/versionamento;
- [x] staging/ingestion — probes reproduzíveis, snapshots e promotion gate;
- [x] `territory_facts`;
- [x] `public_places`;
- [x] categorias de equipamentos públicos;
- [x] Censo 2022 — 12 fatos verificados para os quatro bairros;
- [x] população/demografia básica do MVP;
- [x] educação — 14 unidades verificadas espacialmente;
- [x] saúde — 6 unidades SUS verificadas espacialmente via CNES atual;
- [x] baseline de serviços públicos prioritários — educação + saúde SUS;
- [x] estrutura privada de ingestion runs;
- [x] data quality do baseline — guards/hashes/cross-validation ativos;
- [~] atualização idempotente/periódica — hardening operacional contínuo.

## FASE 3 — Map Core v1 — SOURCE/CI CONCLUÍDA

- [x] core map provider-agnostic;
- [x] viewport/bbox/layers;
- [x] boundaries;
- [x] public places;
- [x] clustering;
- [x] página de mapa;
- [x] deep links de bbox/zoom/categorias;
- [x] mini mapa reutilizável;
- [x] cache HTTP da API;
- [x] cache keys de viewport normalizadas com o deep link;
- [x] guard de bbox/zoom no Core/API;
- [x] guard de bbox/categorias nas RPCs públicas PostGIS;
- [x] smoke público/anon após hardening;
- [x] performance mobile;
- [x] acessibilidade/fallback textual;
- [x] lint + TypeScript + testes + build + bundle;
- [ ] revisão visual no novo deployment — bloqueada apenas pelo deployment Vercel ainda estar no source antigo.

## FASE 4 — Home Territorial — MVP SOURCE/CI CONCLUÍDO

- [~] redesign desktop profissional — source concluído; browser review pendente;
- [~] experiência mobile — source concluído; browser review pendente;
- [x] contexto Salvador/Complexo/bairro;
- [x] seletor Complexo ↔ quatro bairros;
- [x] dados públicos reais;
- [x] `TerritoryMiniMap`;
- [x] deep link para o mapa preservando contexto;
- [x] “agora no bairro” sem feed inventado;
- [x] estados vazios úteis;
- [~] widening bairro → Complexo concluído; Salvador aguarda readiness/dados;
- [x] zero recurso fictício;
- [x] menu/busca sem módulos futuros fingindo disponibilidade;
- [x] adapter em lote para fatos/lugares;
- [x] Data Cache público por escopo territorial;
- [x] SEO fail-closed por rollout, inclusive em falha de leitura;
- [x] canonical por superfície;
- [x] runtime fallback do mapa;
- [x] configuração Supabase pública validada/fail-closed;
- [x] favicon + manifest territorial corrigidos;
- [x] observabilidade server-side redigida;
- [x] health Territory + Classificados;
- [x] source closure Vercel testada;
- [x] production dependency audit no CI;
- [x] CSP/HSTS provider-agnostic;
- [x] Storage de Classificados validado fail-closed;
- [x] RLS anônimo real + policies/grants auditados;
- [x] favoritos alinhados a publicação efetiva (`published_at <= now()`);
- [x] superfícies pessoais/admin `force-dynamic` + `private, no-store`;
- [x] banco v2 sem conteúdo fictício transacional;
- [x] performance advisor pré-deploy revisado; apenas `unused_index` INFO, sem remoção prematura;
- [x] logout-CSRF bloqueado por Origin canônica;
- [x] smoke pós-deploy territorial automatizado;
- [x] remoção de allowlist/estilos marketplace órfãos;
- [x] lint + TypeScript + testes + build + bundle;
- [ ] revisão visual/runtime do novo deployment.

## FASE 5 — Community

Somente após Territory + Data + Map + Home base.

- [ ] posts;
- [ ] comentários;
- [ ] reações;
- [ ] tipos de conteúdo comunitário;
- [ ] mídia;
- [ ] moderação;
- [ ] denúncias;
- [ ] paginação/rate limit;
- [ ] feed territorial.

## FASE 6 — Alerts + Events + Opportunities

- [ ] alertas próprios;
- [ ] fontes comunitárias/oficiais;
- [ ] eventos;
- [ ] vagas/bicos/cursos;
- [ ] integração territorial/mapa.

## FASE 7 — Reintegração de Classificados

Classificados está funcional e **congelado para novas features**.

- [ ] migrar para `territory_id`;
- [ ] remover localização duplicada;
- [ ] integrar mapa;
- [ ] integrar Home territorial;
- [ ] integrar contexto comunitário sem spam;
- [ ] E2E final.

## FASE 8 — Empresas / Serviços

Não iniciar antes dos gates do `URGENTE.md`.

## FASE 9 — Gastronomia

Especialização de Business/Place; não criar plataforma paralela.

## FASE 10 — Mobilidade

Somente com necessidade validada; routing/ETA/corridas não fazem parte da fundação atual.

## Regra de expansão

```text
Complexo
→ Pituba
→ Itaigara
→ Salvador
→ outras cidades
→ Brasil
```

Adicionar território deve ser operação de **dados + readiness + rollout**, e não desenvolvimento específico por bairro.

## Estratégia de legado

- [x] v2 definida como base canônica do produto;
- [x] repositório original classificado como donor/reference, não SSOT;
- [x] mapa de reaproveitamento seletivo em `docs/LEGACY-DONOR-MAP.md`;
- [ ] qualquer migração de domínio aguarda a fase correspondente e passa por auditoria de contratos/RLS/migrations/testes;
- [ ] consolidação/rename dos repositórios somente após FASE 4 release-validada.

Não criar um terceiro repositório para reiniciar o produto novamente.

## Repository release governance

- [x] SECURITY policy versionada;
- [x] CODEOWNERS versionado;
- [x] Dependabot para npm + GitHub Actions;
- [x] PR quality/source-closure gates;
- [x] transport publish restrito à `main`;
- [x] PR real provou publish SKIPPED;
- [ ] proteção administrativa/ruleset da `main` deve ser confirmada/aplicada por conta com permissão administrativa;
- [ ] Dependabot PRs atuais permanecem congelados até FASE 4 release-validada, salvo blocker de segurança.
