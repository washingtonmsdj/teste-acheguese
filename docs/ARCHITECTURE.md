# Arquitetura — Achegue-se

## Objetivo

Construir uma plataforma local escalável sem sacrificar velocidade de produto.

A primeira versão será um **monólito modular** em Next.js. Cada domínio terá fronteiras próprias e contratos claros. Separação em serviços acontecerá somente quando carga, equipe ou requisitos operacionais justificarem.

## Camadas

- `src/app`: composição de rotas, layouts e entrypoints.
- `src/features`: domínios do produto.
- `src/shared`: UI, utilitários e contratos realmente compartilhados.
- `src/server`: acesso a dados, autenticação, filas e integrações quando entrarem.
- `docs`: decisões arquiteturais e plano de entrega.

## Domínios previstos

- discovery — busca, localização, categorias e feed local.
- classifieds — anúncios, categorias, publicação, moderação e contato.
- businesses — perfis comerciais, catálogo, horários, avaliações.
- identity — contas, papéis, sessões e permissões.
- geo — cidades, regiões, coordenadas e proximidade.
- media — uploads e processamento.
- moderation — denúncias, revisão e políticas.
- notifications — preferências e entrega.
- billing — planos e cobrança quando necessário.

## Escala

1. CDN/cache para páginas públicas.
2. PostgreSQL com índices geográficos quando o backend entrar.
3. Paginação cursor-based em feeds.
4. Uploads em object storage, nunca no banco.
5. Jobs assíncronos para mídia, notificações e moderação.
6. Observabilidade desde o MVP.
7. Separar serviços apenas após métricas mostrarem necessidade.

## Mobile-first

O menor viewport é o contrato principal. Desktop é uma expansão da mesma experiência, não uma segunda aplicação.
