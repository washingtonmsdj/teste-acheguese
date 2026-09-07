# Roadmap de execução

## Fase 0 — Fundação
- [x] Repositório e stack inicial.
- [x] App Router + TypeScript estrito.
- [x] Node 24 LTS padronizado.
- [x] Tokens visuais e responsividade mobile-first.
- [x] Documento de arquitetura.
- [x] Contratos de erro/loading/not-found.
- [x] Script local de quality gate (`npm run check`).
- [ ] Lockfile gerado por instalação confiável.
- [ ] Observabilidade externa.

## Fase 1 — Home / Discovery shell
- [x] Home pública v0.
- [x] Componentização de header, hero, busca, categorias e destaques.
- [x] Navegação mobile com estado ativo.
- [x] Rotas estáveis para busca, Classificados, Empresas, Favoritos, login e menu.
- [x] `next/image` para imagens de conteúdo.
- [x] Manifest, robots e sitemap condicionado à URL de produção.
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
- [x] Landing e fluxo visual de novo anúncio.
- [ ] Backend/persistência.
- [ ] Lista + busca + paginação cursor-based.
- [ ] Detalhe do anúncio.
- [ ] Autenticação e autorização.
- [ ] Criar/editar/remover anúncio.
- [ ] Fotos/object storage.
- [ ] Localização.
- [ ] Favoritos.
- [ ] Contato seguro.
- [ ] Moderação/denúncia.
- [ ] Painel "Meus anúncios".
- [ ] SEO.
- [ ] Analytics/observabilidade.
- [ ] Testes E2E.
- [ ] Critérios de lançamento.

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
