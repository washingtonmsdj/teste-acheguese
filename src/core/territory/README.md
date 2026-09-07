# Territory Core

Territory é a fundação geográfica canônica do Achegue-se.

## Modelo

```text
Territory
├── country
├── state
├── city
├── district
└── neighborhood

TerritoryGroup
└── coleção operacional de Territories reais
```

Community não é um Territory. É uma camada social que referencia um Territory.

O Complexo do Nordeste de Amaralina será um `TerritoryGroup` com quatro bairros reais.

## Regras

- nenhum módulo cria sua própria árvore geográfica;
- URLs territoriais devem nascer do `geographicPath`;
- dados públicos referenciam Territory;
- boundaries pertencem ao domínio territorial/geospatial;
- módulos recebem `territoryId`/scope, não nomes livres de bairro;
- Supabase/PostGIS serão adapters do contrato, não parte destes tipos.

Este diretório começa somente com contratos puros. Persistência entra na FASE 1 do `URGENTE.md`.
