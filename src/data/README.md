# Data Platform

`src/data` será a camada de ingestão e qualidade de dados públicos do Achegue-se.

## Responsabilidades

- sources/connectors;
- staging;
- ingestion/ETL;
- provenance;
- quality;
- relatórios de importação;
- jobs de atualização.

## Regras

- não depender de `src/app`;
- não depender de módulos de produto;
- dados oficiais nunca são inventados;
- cada fato importado deve ser rastreável à fonte e período de referência;
- APIs públicas externas alimentam o banco por ingestão, não o request do usuário.

A implementação começa na FASE 2 do `URGENTE.md`.
