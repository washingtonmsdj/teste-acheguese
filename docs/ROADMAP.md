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

## FASE 2 — Territory Data Platform — EM EXECUÇÃO

- [x] `data_sources`;
- [x] provenance/versionamento;
- [x] staging/ingestion — probes reproduzíveis, snapshots e promotion gate;
- [x] `territory_facts`;
- [x] `public_places`;
- [x] categorias de equipamentos públicos;
- [x] Censo 2022 — 12 fatos verificados para os quatro bairros;
- [x] população/demografia básica do MVP;
- [x] educação — 14 unidades verificadas espacialmente;
- [ ] saúde;
- [ ] demais serviços públicos prioritários;
- [x] estrutura privada de ingestion runs;
- [~] data quality — guards/hashes/cross-validation ativos;
- [ ] atualização idempotente/periódica.

## FASE 3 — Map Core v1

- [ ] core map provider-agnostic;
- [ ] viewport/bbox/layers;
- [ ] boundaries;
- [ ] public places;
- [ ] clustering;
- [ ] página de mapa;
- [ ] mini mapa;
- [ ] cache/CDN;
- [ ] performance mobile;
- [ ] acessibilidade.

## FASE 4 — Home Territorial

- [ ] redesign desktop profissional;
- [ ] contexto território/grupo;
- [ ] dados públicos reais;
- [ ] mini mapa;
- [ ] “agora no bairro”;
- [ ] estados vazios úteis;
- [ ] widening bairro → Complexo → Salvador;
- [ ] zero recurso fictício.

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
