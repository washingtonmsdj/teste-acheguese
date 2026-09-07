# Architecture Map — estado e destino

## Estado antes da FASE 0

```text
src/app
  └─ rotas e server actions
src/features/classifieds
  └─ domínio + UI + adapter Supabase
src/features/discovery
  └─ Home/descoberta
src/lib/supabase
src/shared
```

Problemas:

- verticais em `features` sem fronteira formal;
- nenhum Core territorial;
- Classificados possui localização própria baseada em cidade/bairro textual;
- regras arquiteturais existiam apenas em documentação;
- rotas ainda acessam Supabase diretamente em vários fluxos.

## Estrutura alvo progressiva

```text
src/
  app/
  core/
    territory/
    geospatial/
    map/
    identity/
    media/
    moderation/
    search/
    notifications/
    observability/
  data/
    sources/
    ingestion/
    provenance/
    quality/
  modules/
    classifieds/
    community/
    alerts/
    events/
    opportunities/
    businesses/
    gastronomy/
    mobility/
  shared/
```

## Classificação atual

### App/composição
- `src/app/**`

### Plataforma/integração existente
- `src/lib/supabase/**`
- `src/lib/auth/**`
- `src/lib/safe-path.ts`
- `src/lib/site-url.ts`

Esses itens serão movidos para Core/adapters somente quando isso reduzir acoplamento real. Não fazer rename cosmético em massa.

### Module
- `src/modules/classifieds/**`

### Experiência temporária
- `src/features/discovery/**`

Discovery permanece temporariamente em `features` até a FASE 4, quando a Home for reconstruída como superfície territorial. Não promover sua estrutura atual a contrato permanente.

## Dívida conhecida e intencional

- rotas de Classificados ainda acessam Supabase diretamente;
- `ClassifiedLocation` ainda usa `cityId/cityName/neighborhood`;
- tabela `cities` ainda existe;
- media/report/messaging ainda são específicas de Classificados;
- `src/lib/supabase` ainda é infraestrutura compartilhada.

Esses pontos não devem ser "corrigidos" por generalização prematura. Territory Core vem primeiro.
