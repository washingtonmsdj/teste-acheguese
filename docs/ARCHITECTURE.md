# Arquitetura — Achegue-se

## Autoridade

A direção completa está em `/URGENTE.md`.

Decisões arquiteturais permanentes ficam em `docs/adr/`.

## Estilo

O Achegue-se começa e permanece, enquanto fizer sentido, como **monólito modular** em Next.js.

Separação em serviços acontece somente quando carga, equipe, isolamento operacional ou métricas justificarem.

## Camadas

- `src/app`: composição de rotas, layouts e entrypoints.
- `src/core`: capacidades de plataforma e domínio reutilizáveis.
- `src/data`: ingestão, provenance e qualidade de dados territoriais.
- `src/modules`: verticais de produto.
- `src/shared`: UI/utilitários realmente neutros.
- `src/lib`: adapters/utilidades de infraestrutura ainda em transição.

## Regra de dependência

```text
app → modules/core/shared
modules → core/shared
data → core/shared
core → shared
shared → nenhuma camada de domínio
```

Proibido:

```text
core → modules
core → app
shared → core/modules/app/data
modules → app
data → app/modules
```

O CI deve rejeitar essas dependências.

## Domínio central

Territory é a fundação do produto.

Cidade e bairro são tipos territoriais, não domínios separados.

`TerritoryGroup` agrega territórios reais sem alterar a hierarquia oficial.

Community, Classificados, Empresas, Eventos e demais verticais referenciam Territory.

## Escala

1. PostgreSQL + PostGIS para dados territoriais/geoespaciais.
2. CDN/cache para conteúdo público e boundaries.
3. Paginação cursor-based.
4. Map queries por bbox/zoom/layers.
5. Object storage para mídia.
6. ETL/jobs fora do request web.
7. Observabilidade desde o MVP.
8. Serviços separados somente após evidência operacional.

## Referências

- `/URGENTE.md`
- `docs/ARCHITECTURE-MAP.md`
- `docs/adr/0001-territory-first-platform.md`
