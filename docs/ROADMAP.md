# Roadmap de execução

## Fase 0 — Fundação
- [x] Repositório e stack inicial.
- [x] App Router + TypeScript estrito.
- [x] Node 24 LTS padronizado.
- [x] Tokens visuais e responsividade mobile-first.
- [x] Documento de arquitetura.
- [x] Contratos de erro/loading/not-found.
- [x] `package-lock.json` reproduzível.
- [x] Quality gate público: `npm ci` → lint → typecheck → tests → build.
- [x] Testes rápidos de domínio no runner nativo do Node.
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
- [ ] Busca global ligada aos dados persistidos.
- [ ] SEO local e dados estruturados.
- [ ] Acessibilidade automatizada.

## Fase 2 — Classificados MVP — PRIMEIRO VERTICAL COMPLETO
Objetivo: entregar Classificados do anúncio ao contato, pronto para uso real.

### Fundação e backend
- [x] Projeto Supabase isolado `acheguese-v2` em `sa-east-1`.
- [x] Migrations versionadas e histórico alinhado com o banco.
- [x] RLS e grants mínimos.
- [x] Security advisors: 0 lints.
- [x] Performance advisors sem warnings estruturais; apenas índices ainda sem uso.
- [x] Tipos TypeScript gerados do schema real.
- [x] `@supabase/ssr` + proxy de refresh de sessão.
- [x] Auth por e-mail/senha e callback implementados.
- [x] Salvador/BA como primeiro território real.
- [x] Bucket privado de imagens.
- [x] MIME restrito + 8 MB por imagem + até 10 posições.

### Fluxo do anunciante
- [x] Criação de rascunho.
- [x] Edição de rascunho/pausado/rejeitado.
- [x] Upload e remoção de fotos com ownership.
- [x] Painel "Meus anúncios".
- [x] Envio para revisão exigindo ao menos uma foto.
- [x] Conteúdo bloqueado enquanto está em revisão.
- [x] Retirada da revisão para voltar a rascunho.
- [x] Motivo de rejeição/ajuste visível ao dono.
- [x] Pausar anúncio publicado.
- [x] Marcar anúncio como vendido.
- [x] Arquivar.
- [x] Excluir somente quando não houver histórico relevante.
- [x] Limpeza de Storage no fluxo de exclusão.

### Fluxo público
- [x] Listagem persistida.
- [x] Busca textual.
- [x] Filtro por categoria.
- [x] Território inicial Salvador.
- [x] Paginação cursor-based.
- [x] Página pública de detalhe.
- [x] Favoritos.
- [x] Contato seguro por conversa interna.
- [x] Inbox e thread privada comprador ↔ anunciante.
- [x] Denúncia de anúncio publicado.

### Moderação
- [x] Claim administrativo assinado em `app_metadata`.
- [x] Admin sem autoridade por `user_metadata`.
- [x] Fila de anúncios pendentes.
- [x] Aprovar e publicar.
- [x] Rejeitar com motivo.
- [x] Retirar publicado para ajustes.
- [x] Auditoria privada de decisões.
- [x] Painel de denúncias.
- [x] Admin impedido de editar conteúdo do anúncio durante moderação.

### Restante para MVP real
- [ ] Criar/ativar deploy Vercel isolado para este repositório.
- [ ] Configurar `NEXT_PUBLIC_SUPABASE_URL` e publishable key no deploy.
- [ ] Configurar URL/callback de Auth para o domínio real.
- [ ] Criar conta real e atribuir `app_metadata.role=classified_admin` ao administrador.
- [ ] Teste real de cadastro/login/confirmação/logout em navegador.
- [ ] Teste real de upload e signed URLs em navegador.
- [ ] Testes E2E: publicar → revisar → favoritar → conversar → denunciar → moderar → encerrar.
- [ ] SEO de anúncios/categorias + dados estruturados.
- [ ] Analytics/observabilidade.
- [ ] Acessibilidade automatizada.
- [ ] Critérios finais de lançamento e runbook operacional.

## Fase 3 — Empresas MVP
Só inicia quando Classificados atingir Definition of Done.

## Regra de execução
Uma vertical só é considerada pronta quando cobre:
produto + mobile + desktop + dados + segurança + moderação + SEO + observabilidade + testes + operação.
