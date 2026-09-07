# Territory Core v1

## Status

Territory Foundation v1 está aplicada no Supabase canônico `acheguese-v2`.

## Estrutura atual

```text
Brasil
└── Bahia
    └── Salvador
        ├── Chapada do Rio Vermelho
        ├── Nordeste de Amaralina
        ├── Santa Cruz
        └── Vale das Pedrinhas

TerritoryGroup
└── Complexo do Nordeste de Amaralina
    └── 4 membros
```

## PostGIS

- extensão: `postgis 3.3.7`
- schema: `extensions`
- centros: `geometry(Point,4326)`
- boundaries: `geometry(MultiPolygon,4326)`
- índices espaciais: GiST

## Boundaries iniciais

Fonte:

`GeoSalvador / bairros_app_dados_2010_e_2022`

Layer:

`FeatureServer/0`

| Bairro | Object ID | Pontos | Área aproximada |
|---|---:|---:|---:|
| Chapada do Rio Vermelho | 54 | 233 | 612.066 m² |
| Nordeste de Amaralina | 112 | 233 | 643.209 m² |
| Santa Cruz | 142 | 208 | 601.390 m² |
| Vale das Pedrinhas | 163 | 187 | 156.041 m² |

As quatro geometrias passaram em `ST_IsValid` e não estão vazias.

## Segurança

Leitura pública:

- territories visíveis;
- territory groups visíveis;
- members visíveis;
- boundaries visíveis.

`anon` e `authenticated` não recebem privilégios de escrita nessas tabelas.

Security advisors após as migrations: **0 lints**.

## Compatibilidade

O schema antigo:

- `cities`
- `classifieds.city_id`
- `classifieds.neighborhood`

continua intacto.

A migração de Classificados para `territory_id` será feita somente na FASE 7 do plano, ou antes apenas se for necessária para consumir Territory sem quebrar o vertical.

## Próximo bloco

Territory Data Platform:

1. data sources/provenance;
2. facts demográficos;
3. public places;
4. ingestão oficial;
5. quality/readiness.
