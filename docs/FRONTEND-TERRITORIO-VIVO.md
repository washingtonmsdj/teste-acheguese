# Frontend — Território Vivo

## Autoridade visual

A direção canônica do frontend do Achegue-se é **Território Vivo**.

O objetivo não é reproduzir literalmente um mock estático. O frontend deve preservar a lógica aprovada do concept art e, ao mesmo tempo, obedecer o estado real das fases do produto.

Princípios:

1. território antes de módulo;
2. informação e utilidade antes de promoção;
3. mapa como elemento protagonista;
4. navegação global adaptativa;
5. desktop adiciona contexto — não apenas amplia o mobile;
6. evitar aparência de dashboard SaaS, portal público ou marketplace genérico;
7. cards somente quando ajudam a leitura;
8. nenhum módulo futuro aparece publicamente antes de estar release-validado;
9. nenhum conteúdo fictício é criado apenas para preencher o concept.

## Estrutura responsiva canônica

### Mobile

- header compacto;
- conteúdo territorial;
- bottom navigation;
- somente destinos realmente disponíveis aparecem;
- a estrutura pode evoluir para Community / Postar / Explorar / Perfil quando essas superfícies existirem de verdade.

Hoje: Início, Mapa, Classificados e Menu.

Não adicionar botões mortos para reproduzir mock.

### Desktop

A estrutura aprovada é Sidebar territorial + Conteúdo principal + Rail contextual.

Implementação:

- App Shell: src/shared/layout/territory-app-shell.tsx;
- CSS do shell: src/shared/layout/territory-app-shell.module.css;
- registry de navegação/fases: src/shared/navigation/territory-navigation.ts;
- ícones: src/shared/navigation/navigation-icon.tsx.

Breakpoints atuais:

- abaixo de 980 px: header + bottom navigation;
- 980 px+: sidebar + conteúdo;
- 1280 px+ quando há contexto: sidebar + conteúdo + rail;
- 1360 px+: Home usa composição hero + mapa lado a lado quando há largura útil suficiente mesmo com rail;
- 1600 px+: a composição ganha mais respiro e quatro colunas nas grades de bairro/utilidade.

## Registry e módulos futuros

O registry é a autoridade de navegação. A bottom navigation também deriva dele por `mobilePrimary`; não manter arrays/sets paralelos de destinos mobile.

Módulos planejados já possuem posição estrutural, mas usam availability: planned:

- Community — FASE 5;
- Alertas — FASE 6;
- Eventos — FASE 6;
- Oportunidades — FASE 6;
- Empresas — FASE 8.

Enquanto estiverem planned, não aparecem na sidebar, header, menu ou bottom navigation e não devem ganhar rotas placeholder públicas.

Quando uma fase for liberada, a navegação deve ser ativada pela mesma autoridade, sem criar um segundo menu paralelo.

## Superfícies atuais no App Shell

Usam o App Shell global:

- Home territorial;
- Mapa;
- Busca;
- Classificados — listagem e detalhe;
- Favoritos;
- Mensagens — inbox e conversa;
- Meus anúncios;
- Novo anúncio;
- Editar/gerenciar anúncio;
- Moderação administrativa de Classificados.

Permanecem standalone por design:

- `/entrar` — superfície de autenticação;
- `/menu` — navegação fullscreen mobile;
- estados globais de erro/404.

Essas superfícies standalone não podem criar uma segunda navegação global.

## Home

A Home mantém contexto territorial, troca Complexo ↔ bairro, mapa, dados públicos reais, bairros, utilidades disponíveis, módulos ativos como conteúdo secundário e fontes/proveniência.

O rail contextual usa apenas informação real: população, locais públicos, educação, saúde SUS, estado do rollout e fontes.

## Mapa

O Mapa usa o mesmo App Shell em variante imersiva e preserva viewport query, clustering, filtros, deep links, fallback textual, reduced motion e guards de bbox/zoom/categorias.

## Relação com o concept art aprovado

### Já materializado

- território como organizador;
- navegação persistente no desktop;
- toolbar contextual;
- busca visível;
- sidebar;
- conteúdo principal separado do contexto;
- rail lateral real, alinhado visualmente à toolbar;
- mapa protagonista;
- bloco de dados públicos em contraste escuro para quebrar a sequência de superfícies claras;
- troca de território;
- bottom navigation mobile;
- sistema verde-mangue com superfícies naturais e acentos quentes/coral;
- estados de loading coerentes;
- estrutura pronta para módulos futuros;
- navegação global sem duplicação: `SiteHeader` antigo removido e `MobileTabbar` pertencente somente ao App Shell;
- destinos da bottom navigation derivados do registry por `mobilePrimary`, permitindo preparar Community sem exibi-la antes da fase.

### Deliberadamente não materializado ainda

- feed Community;
- botão global + Postar;
- Alertas ativos;
- Eventos ativos;
- Oportunidades ativas;
- Empresas da região;
- promoções/comércio comunitário;
- hero fotográfico territorial.

Esses itens só entram quando houver fase, dados e conteúdo reais.

Para o hero, não usar stock/foto arbitrária apenas para parecer com o mock. Até existir imagem territorial própria/licenciada e adequada, o mapa real é o visual territorial prioritário.

## Contratos anti-regressão

- test/navigation-registry.test.mjs — planned não aparece como active;
- test/territory-app-shell-contract.test.mjs — superfícies atuais permanecem no App Shell; todas as páginas são varridas para impedir import direto de header/tabbar paralelos; o `SiteHeader` legado deve permanecer inexistente;
- test/frontend-copy-contract.test.mjs — linguagem de implementação/roadmap não vaza para a UI.

## Próximo gate visual

A fidelidade final não deve ser declarada apenas por source.

É obrigatório validar no deployment candidato: desktop 1440×900, mobile 390×844, teclado/foco, reduced motion, layout shift/loading, mapa real e logs/runtime.

Correções após essa revisão devem ser baseadas em defeitos observados no deployment, não em reescrever a arquitetura.


## Acessibilidade de interação

No checkpoint de frontend pós-candidate, os controles interativos principais foram normalizados para alvo mínimo de aproximadamente 44 px:

- botão de menu mobile e fechar do menu;
- conta na toolbar desktop;
- seletor de território/bairro;
- links do rail contextual, inclusive Classificados;
- voltar do Mapa;
- itens acionáveis da lista do Mapa.

Isso complementa foco visível, `aria-pressed`, lista textual do mapa e reduced-motion já existentes.
