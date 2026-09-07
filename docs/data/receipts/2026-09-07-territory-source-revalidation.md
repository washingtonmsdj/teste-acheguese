# Receipt — Revalidação das fontes territoriais

Data: 2026-09-07  
GitHub run: `34155391384`  
Source commit: `e2a0c45aa410846ec624c884ededa93358b7d6ff`

## Objetivo

Revalidar as fontes oficiais já promovidas para o MVP territorial depois do hardening dos workflows, sem promover dados automaticamente.

A regra desta campanha foi:

> se o conteúdo normalizado já promovido continuar idêntico, registrar nova evidência e **não** criar migration/mutação de banco.

## Censo 2022

Fonte:

- Prefeitura Municipal de Salvador / GeoSalvador;
- dataset `censo_2010_e_2022_por_bairro`.

Probe atual:

- artifact ID: `10030776680`;
- raw SHA-256: `6225cada24a06eb8f280ffe9a8da4fe3d6a1e554748bccd15e6fb07c811cf115`;
- normalized SHA-256: `89b4bcc4d385cee338beb65c43b39d88951a1392a6c2886c89c7ea00fd17a420`;
- records: 4.

Comparação com receipt promovida `2026-09-07-census-complexo-2022.md`:

- raw SHA: **igual**;
- normalized SHA: **igual**;
- 4/4 bairros: **igual**;
- população/domicílios: **iguais**.

Resultado: **UNCHANGED**.

## Educação

Fonte:

- Prefeitura Municipal de Salvador / GeoSalvador;
- `Unidades_Educacionais_AGOL`.

Probe atual:

- artifact ID: `10030776901`;
- raw SHA-256: `9099597d854a329410f9f828e5b12ea5b00e857869beaf26b889a5df9d0cf32b`;
- normalized SHA-256: `696604e2528b1608f041651be2fd76dc6de17331f4f37b8f35654a4b5d3c3c02`;
- fonte total: 433;
- dentro do MVP: 14;
- fora do MVP: 419;
- divergências rótulo textual × geometry: 8.

Contagens atuais:

- Chapada do Rio Vermelho: 3;
- Nordeste de Amaralina: 2;
- Santa Cruz: 8;
- Vale das Pedrinhas: 1.

Comparação com receipt promovida `2026-09-07-education-complexo.md`:

- raw SHA: **igual**;
- normalized SHA: **igual**;
- contagens territoriais: **iguais**;
- mismatch textual: **8/14**, igual.

Resultado: **UNCHANGED**.

## Saúde SUS / CNES

Fonte:

- Ministério da Saúde / CNES;
- `cnes_estabelecimentos_json.zip`.

Probe metadata atual:

- artifact ID: `10030779440`;
- source last modified: `2026-09-05T06:59:02Z`;
- archive SHA-256: `8908498b9d1ae69ce475dffe1b8259fa7d74b051551660034f0f3501784f337a`;
- archive size: 67.680.083 bytes;
- JSON member: `cnes_estabelecimentos.json`.

Probe territorial atual:

- artifact ID: `10030779656`;
- national records: 635.118;
- Salvador records: 5.501;
- Salvador ativos: 3.952;
- ativos com coordenadas: 3.951;
- dentro do MVP: 52;
- SUS selecionados: 6;
- não-SUS/privados adiados: 46;
- normalized SHA-256: `5ae2db990b81a0655a2abb77a77ec63e1c7349de4f398f9f24ba2bfcdf135098`.

Contagens atuais:

- Chapada do Rio Vermelho: 0;
- Nordeste de Amaralina: 2;
- Santa Cruz: 1;
- Vale das Pedrinhas: 3.

Comparação com receipt promovida `2026-09-07-health-cnes-complexo.md`:

- source last modified: **igual**;
- archive SHA: **igual**;
- normalized SHA: **igual**;
- seleção SUS 6/6: **igual**;
- contagens territoriais: **iguais**.

Resultado: **UNCHANGED**.

## Metadata das fontes públicas

O job `public-places-metadata` também passou e confirmou acessibilidade das fontes GeoSalvador usadas como referência/provenance.

Artifact ID: `10030776646`.

## Decisão

**NO DB MUTATION**  
**NO MIGRATION**  
**NO ROLLOUT CHANGE**

As fontes oficiais revalidadas produziram o mesmo conteúdo canônico já promovido.

O rollout permanece `data_preparation`.

Qualquer futura divergência de raw/normalized SHA ou contagem deve abrir nova análise antes de atualizar o banco.
