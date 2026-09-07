# Territory Data Platform

Esta camada organiza dados públicos e oficiais usados pelo Achegue-se.

## Fluxo canônico

```text
fonte oficial
→ snapshot/versionamento
→ ingestão privada
→ validação
→ dado provisional
→ verificação
→ leitura pública
```

## Entidades

- `territory_data_sources`: dataset estável e sua autoria/licença;
- `territory_data_snapshots`: versão/checksum/fetch do dataset;
- `private.territory_ingestion_runs`: execução e erros internos;
- `territory_metric_definitions`: catálogo de métricas;
- `territory_facts`: fatos versionados por território;
- `public_place_categories`: taxonomia de equipamentos;
- `public_places`: equipamentos/lugares públicos canônicos.

## Regra de publicação

Um fato ou lugar só pode ter `quality_status = verified` se:

1. o snapshot estiver `verified` ou `superseded`;
2. o snapshot estiver público;
3. a fonte estiver pública.

O banco impõe essa regra por trigger.

## Segurança

Clientes `anon` e `authenticated` possuem somente SELECT dos dados públicos.
Ingestão e escrita são reservadas à camada interna/service role.

## Estado inicial

Nenhum número demográfico ou lugar foi inventado ou carregado nesta fundação.
Apenas a taxonomia genérica de 11 categorias públicas foi criada.

Próximo passo: cadastrar a primeira fonte oficial validada e seu snapshot antes de importar dados.
