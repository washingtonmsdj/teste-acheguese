# Map Core v1

## Status

FASE 3 iniciada após o fechamento da base territorial mínima:

- 4 boundaries;
- 12 fatos demográficos verificados;
- 14 unidades educacionais;
- 6 unidades SUS.

## Decisões reaproveitadas do projeto antigo

Reaproveitar:

1. domínio antes de UI;
2. provider não vaza para o Core;
3. viewport/bbox como unidade de consulta;
4. layers explícitas;
5. deep link e mini-map como consumidores do mesmo Core.

Não reaproveitar agora:

- routing;
- ETA;
- mobilidade;
- geocoding externo;
- tourist points;
- registries globais;
- tipos de módulos ainda inexistentes;
- carregamento de markers de um território inteiro.

## Contrato v1

O navegador consulta:

```text
bbox
+ zoom
+ layers
+ categorias opcionais
+ limite
```

PostGIS retorna apenas os dados do viewport.

### Layers do Core

- `boundaries`
- `public_places`

Community, Events, Alerts, Classificados e Businesses não são conhecidos pelo Map Core neste estágio. Quando existirem, adapters próprios projetarão suas entidades para contratos de mapa sem inverter dependências.

## Limites

- até 500 pontos por consulta;
- até 500 boundaries por consulta;
- bbox WGS84 obrigatório;
- zoom 0..24;
- RLS permanece autoridade;
- funções SQL são `security invoker`.

## Contrato provado do MVP

Bbox do Complexo:

```text
west  -38.4873837606422
south -13.0134576151743
east  -38.4668939364098
north -12.9958446983238
```

Resultado público atual:

- 4 boundaries;
- 20 public places;
- 14 education;
- 6 health.

## Próximo passo

Implementar o provider visual como adapter do Core, começando por MapLibre somente após verificar a versão/documentação atual. A página `/mapa` deve consumir `MapDataRepository`, nunca Supabase diretamente.
