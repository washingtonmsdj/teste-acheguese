# Fontes territoriais — registro canônico

## GeoSalvador — Censo 2010 e 2022 por bairro

**Status:** fonte cadastrada; snapshot de dados ainda não criado.

- Provider: Prefeitura Municipal de Salvador / GeoSalvador
- Dataset: `censo_2010_e_2022_por_bairro`
- Service Item ID: `4cd441755e6349eab281f7dcd42f8ad8`
- Layer: `censo_2010_e_2022` (0)
- Spatial reference: EPSG 31984
- Object ID: `FID`
- Bairro: `NOME_BAIRR`
- Data Last Edit informado pelo ArcGIS: `5/23/2025 5:29:38 PM`
- Schema Last Edit: `5/27/2025 6:42:02 PM`

Layer canônica:
`https://services6.arcgis.com/GP5qdNaePRPh2SdT/ArcGIS/rest/services/censo_2010_e_2022_por_bairro/FeatureServer/0`

### Mapeamento MVP — Censo 2022

| Métrica canônica | Campo | Alias oficial |
| --- | --- | --- |
| population_total | C001 | População Total |
| population_male | C002 | População Masculina |
| population_female | C003 | População Feminina |
| population_density | C004 | Densidade Demográfica |
| population_literate | C018 | População Alfabetizada |
| households_total | C026 | Domicílios Particulares e Coletivos |
| households_permanent | C027 | Domicílios Particulares Permanentes |

### Política

Não criar `territory_data_snapshots` nem `territory_facts` a partir de valores copiados manualmente.

O snapshot só nasce depois de:

1. query reproduzível do layer oficial;
2. exatamente quatro bairros esperados;
3. nenhum bairro duplicado/inesperado;
4. todos os campos canônicos válidos;
5. payload preservado/checksum identificável;
6. ingestion run registrada.

O parser correspondente está em:
`src/data/sources/geosalvador/census-2010-2022.ts`.

## Educação e saúde

Os serviços `Unidades_educacao`, `Unidades_Educacionais_AGOL`, `Escolas` e `Unidades_Saude` aparecem no diretório atual do GeoSalvador.

Ainda **não estão cadastrados como fontes canônicas** porque seus schemas/versões precisam ser inspecionados e validados antes da ingestão.
