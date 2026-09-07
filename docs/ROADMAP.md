# Roadmap de execução

## Fase 0 — Fundação
- [x] Repositório e stack inicial.
- [x] App Router + TypeScript estrito.
- [x] Node 24 LTS padronizado.
- [x] Tokens visuais e responsividade mobile-first.
- [x] Documento de arquitetura.
- [x] Contratos de erro/loading/not-found.
- [x] `package-lock.json` reproduzível.
- [x] Quality gate público: `npm ci` → lint → typecheck → build.
- [ ] Observabilidade externa.

## Fase 1 — Home / Discovery shell
- [x] Home pública v0.
- [x] Componentização de header, hero, busca, categorias e destaques.
- [x] Navegação mobile com estado ativo.
- [x] Rotas estáveis para busca, Classificados, Empresas, Favoritos, login e menu.
- [x] `next/image` para conteúdo visual.
- [x] Manifest, robots e sitemap condicionado à URL de produção.
- [x] Remoção de links públicos mortos e métricas fictícias.
- [ ] Revisão visual fina em navegador real.
- [ ] Localização real do usuário.
- [ ] Busca ligada aos dados persistidos.
- [ ] SEO local e dados estruturados.
- [ ] Acessibilidade automatizada.

## Fase 2 — Classificados MVP — PRIMEIRO VERTICAL COMPLETO
Objetivo: entregar Classificados do anúncio ao contato, pronto para uso real.

### Fundação concluída
- [x] Projeto Supabase isolado `acheguese-v2` em `sa-east-1`.
- [x] Migrations versionadas e histórico alinhado com o banco.
- [x] RLS e grants mínimos.
- [x] Security advisors: 0 lints.
- [x] Índices principais de feed, owner, busca, favoritos e denúncias.
- [x] Tipos TypeScript gerados do schema real.
- [x] `@supabase/ssr` + proxy de refresh de sessão.
- [x] Auth por e-mail/senha e callback implementados.
- [x] Taxonomia inicial.
- [x] Salvador/BA como primeiro território real.
- [x] Bucket privado de imagens.
- [x] MIME restrito + 8 MB por imagem + até 10 posições.
- [x] Criação de rascunho.
- [x] Edição de rascunho/pausado/rejeitado.
- [x] Upload e remoção de fotos com ownership.
- [x] Painel "Meus anúncios".
- [x] Envio para revisão exigindo ao menos uma foto.
- [x] Conteúdo bloqueado enquanto está em revisão.
- [x] Retirada da revisão para voltar a rascunho.
- [x] `anon` sem EXECUTE nas funções de workflow.

### Restante para MVP
- [ ] Ativar URL + publishable key no ambiente de deploy isolado.
- [ ] Teste real de cadastro/login/callback em navegador.
- [ ] Listagem pública persistida + filtros + paginação cursor-based.
- [ ] Página pública de detalhe do anúncio.
- [ ] Favoritos.
- [ ] Contato seguro.
- [ ] Fluxo administrativo de moderação e publicação.
- [ ] Denúncia pela interface + painel de revisão.
- [ ] Pausar/vendido/arquivar/excluir com UX completa.
- [ ] SEO de anúncios e categorias.
- [ ] Analytics/observabilidade.
- [ ] Testes de integração/E2E.
- [ ] Critérios finais de lançamento.

## Fase 3 — Empresas MVP
Só inicia quando Classificados atingir Definition of Done.

## Regra de execução
Uma vertical só é considerada pronta quando cobre:
produto + mobile + desktop + dados + segurança + moderação + SEO + observabilidade + testes + operação.
