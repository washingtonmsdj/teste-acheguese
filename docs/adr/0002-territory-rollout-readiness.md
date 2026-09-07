# ADR 0002 — Territory lifecycle, rollout e readiness

**Status:** Accepted  
**Date:** 2026-09-07

## Problema

Um território geograficamente válido pode existir no banco muito antes de o produto estar pronto para ser oferecido naquele território.

Misturar esses conceitos cria um risco grave: cadastrar um bairro, boundary ou dado oficial poderia acidentalmente fazê-lo parecer "lançado".

## Decisão

Separar três conceitos.

### 1. Territory status

`territories.status` descreve o ciclo de vida do registro geográfico:

- `active`: território válido e utilizável pela plataforma;
- `coming_soon`: registro geográfico conhecido, ainda em preparação;
- `inactive`: território não deve ser usado em novas operações.

Esse campo **não significa lançamento do produto**.

### 2. Product rollout

`territory_rollouts.stage` controla a exposição operacional do Achegue-se:

- `data_preparation`
- `internal_preview`
- `public_preview`
- `launched`
- `paused`

Um Territory pode estar `active` e continuar em `data_preparation`.

Somente `public_preview` e `launched` são considerados estágios públicos de produto.

### 3. Readiness

Readiness é uma avaliação de qualidade baseada em evidências, não um botão de lançamento e não um número inventado manualmente.

Será calculada a partir de indicadores como:

- boundary válido;
- centro/bbox;
- provenance;
- dados demográficos essenciais;
- equipamentos públicos;
- mapa;
- URLs;
- qualidade de ingestão;
- moderação/operabilidade quando aplicável.

O modelo de readiness será implementado junto da Territory Data Platform, quando os dados que o alimentam existirem.

## Regras

1. rollout nunca é inferido apenas de `territories.status`;
2. adicionar um bairro não o lança;
3. importações de dados não alteram rollout automaticamente;
4. readiness não altera rollout sem uma ação operacional explícita;
5. não criar rollout por módulo antes de haver segundo consumidor real e necessidade comprovada;
6. novos territórios devem iniciar em `data_preparation`.

## Estado inicial

Os quatro bairros do Complexo e o TerritoryGroup do Complexo começam em `data_preparation`.

Isso é intencional mesmo com boundaries válidos.

## Consequências

- expansão territorial fica fail-closed;
- dados podem ser preparados antecipadamente;
- Home/mapa podem diferenciar "território conhecido" de "produto lançado";
- futuras cidades podem ser ingeridas em lote sem exposição acidental.
