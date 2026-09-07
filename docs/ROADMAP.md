# Roadmap de execução

## Fase 0 — Fundação
- [x] Repositório e stack inicial.
- [x] App Router + TypeScript estrito.
- [x] Node 24 LTS padronizado.
- [x] Tokens visuais e responsividade mobile-first.
- [x] Documento de arquitetura.
- [x] Contratos de erro/loading/not-found.
- [x] Script local de quality gate (`npm run check`).
- [x] `package-lock.json` gerado em runner Node 24 e versionado.
- [x] Quality gate público: `npm ci` → lint → typecheck → build.
- [ ] Observabilidade externa.

## Fase 1 — Home / Discovery shell
- [x] Home pública v0.
- [x] Componentização de header, hero, busca, categorias e destaques.
- [x] Navegação mobile com estado ativo.
- [x] Rotas estáveis para busca, Classificados, Empresas, Favoritos, login e menu.
- [x] `next/image` para imagens de conteúdo.
- [x] Manifest, robots e sitemap condicionado à URL de produção.
- [x] Remoção de links públicos mortos e métricas fictícias.
- [ ] Revisão visual fina em navegador real.
- [ ] Localização real.
- [ ] Busca com dados persistidos.
- [ ] SEO local e dados estruturados.
- [ ] Acessibilidade automatizada.

## Fase 2 — Classificados MVP — PRIMEIRO VERTICAL COMPLETO
Objetivo: entregar Classificados do anúncio ao contato, pronto para uso real.

- [x] Estados e tipos de domínio.
- [x] Taxonomia inicial.
- [x] Contrato de repositório isolado.
- [x] Landing de Classificados com busca/filtros por URL.
- [x] Estado vazio de produto sem dados fictícios.
- [x] Fluxo visual de novo anúncio.
- [x] Validação server-side de entrada modelada.
- [x] Contrato SQL draft com RLS, índices e dados privados separados.
- [x] Boundary oficial de Supabase SSR preparado e inativo sem configuração.
- [ ] Criar projeto Supabase novo e isolado.
- [ ] Aplicar migration revisada e executar advisors.
- [ ] Gerar tipos do banco.
- [ ] Ativar refresh de sessão SSR.
- [ ] Autenticação e autorização.
- [ ] Criar/editar/remover anúncio.
- [ ] Fotos/object storage.
- [ ] Lista persistida + busca + paginação cursor-based.
- [ ] Detalhe do anúncio.
- [ ] Localização.
- [ ] Favoritos.
- [ ] Contato seguro.
- [ ] Moderação/denúncia.
- [ ] Painel "Meus anúncios".
- [ ] SEO.
- [ ] Analytics/observabilidade.
- [ ] Testes E2E.
- [ ] Critérios de lançamento.

### Blocker atual

A organização Supabase `Tonecos` atingiu o limite de 2 projetos gratuitos ativos.
Os dois projetos ativos existentes não foram alterados.
O novo projeto `acheguese-v2` só pode ser criado após liberar uma vaga ou alterar o plano.

## Fase 3 — Empresas MVP
Somente inicia quando Classificados atingir Definition of Done.

- [ ] Perfil comercial.
- [ ] Categorias.
- [ ] Busca e proximidade.
- [ ] Horários e contatos.
- [ ] Galeria/catálogo.
- [ ] Avaliações.
- [ ] Reivindicação/verificação.
- [ ] Painel do negócio.

## Regra de execução

Uma vertical só é considerada pronta quando cobre:
produto + mobile + desktop + dados + segurança + moderação + SEO + observabilidade + testes + operação.
