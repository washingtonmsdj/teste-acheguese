# Receipt — Saúde SUS do Complexo

Data: 2026-09-07

## Fonte e prova

- key: `cnes-estabelecimentos-sus`
- provider: Ministério da Saúde / CNES
- GitHub run: `34102438196`
- commit: `85590ae2a6c2284afa6d2dd04df7911fc5c9a2d9`
- artifact ID: `10011007807`
- artifact digest: `sha256:b30c8961e6e5c7d6de7b120935a16bb5277f512b626d6982c3ee56d950640ed6`
- archive SHA-256: `8908498b9d1ae69ce475dffe1b8259fa7d74b051551660034f0f3501784f337a`
- normalized SHA-256: `5ae2db990b81a0655a2abb77a77ec63e1c7349de4f398f9f24ba2bfcdf135098`

## Gate

- Salvador ativos: 3.952;
- ativos com coordenadas: 3.951;
- dentro dos boundaries do MVP: 52;
- SUS selecionados: 6;
- adiados não-SUS/privados: 46;
- point-in-boundary: 6/6;
- PostGIS ST_Covers independente: 6/6;
- security advisors: 0 lints;
- rollout permaneceu `data_preparation`.

## Resultado

- Nordeste de Amaralina: 2;
- Santa Cruz: 1;
- Vale das Pedrinhas: 3;
- Chapada do Rio Vermelho: 0.

O snapshot e as seis unidades foram promovidos para `verified/public` somente após artifact, política SUS e validação espacial.
