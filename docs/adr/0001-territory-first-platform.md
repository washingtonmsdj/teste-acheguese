# ADR 0001 — Territory-first Platform

**Status:** Accepted  
**Date:** 2026-09-07

## Contexto

O Achegue-se começou tecnicamente por Classificados, mas a visão de produto é uma plataforma comunitária e territorial. Continuar deixando verticais definirem localização, mapa, mídia, moderação e busca criaria mini-sistemas incompatíveis e retrabalho na expansão.

O produto precisa começar no Complexo do Nordeste de Amaralina e escalar para Salvador, outras cidades e Brasil.

## Decisão

Adotar arquitetura **Territory-first** em monólito modular.

Ordem de plataforma:

```text
Platform Foundation
→ Territory
→ Territory Data
→ Map
→ Home territorial
→ Community
→ demais módulos
```

`Territory` é a entidade geográfica raiz. Cidade e bairro são tipos de Territory.

`TerritoryGroup` agrega territórios reais sem alterar a hierarquia oficial.

Módulos dependem do Core; o Core nunca depende de módulos.

Classificados permanece funcional, mas deixa de ditar arquitetura e fica congelado para novas features até ser adaptado ao Territory Core.

## Consequências positivas

- um único sistema territorial;
- expansão por dados/rollout, não por código específico de bairro;
- mapa e dados públicos reutilizados;
- módulos futuros chegam organizados;
- menor risco de duplicação;
- mantém modular monolith e evita microservices prematuros.

## Custos

- Classificados precisará migrar de `city_id/neighborhood` para o novo contrato;
- parte da estrutura atual será reorganizada;
- dados territoriais exigem provenance e pipelines;
- PostGIS passa a ser parte da fundação.

## Não decidido neste ADR

- provider visual final do mapa;
- mecanismo futuro de busca dedicado;
- estratégia de particionamento;
- mobilidade/routing/ETA;
- abstração genérica de favorites/messages/reports.

Esses pontos só serão generalizados quando houver necessidade real.
