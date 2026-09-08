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


## Candidate visual source-aligned

Checkpoint técnico: `bab5273b1c6b757cbd3d0b583416f6c441e533ef`.

Deployment: `dpl_GC8UYAX1Rx8ZjiffMkby4TCwofWq`.

Provas já disponíveis:

- quality + source bundle PASS no SHA exato;
- Vercel READY;
- configuração pública fail-closed PASS;
- compile/TypeScript/static generation PASS;
- Home chegou ao runtime com HTTP 200;
- runtime errors = 0;
- segurança Supabase = 0 lints;
- rollout continua não público.

A revisão pixel-level continua pendente porque o preview exige sessão SSO persistente e o Chromium local desta execução não possui DNS externo. Não inferir aprovação 1440×900 ou 390×844 apenas pelo source.


## Busca e Menu

Checkpoint: `7209f8242de36ec7d6c1f5c85cff72b64105fec3`.

Busca passa a funcionar como hub territorial:

- Mapa territorial para informação pública;
- Classificados para anúncios;
- contexto do Complexo visível;
- nenhuma busca universal simulada antes de existir índice/conteúdo suficiente.

Menu fullscreen recebeu:

- contexto territorial;
- ícones alinhados ao mesmo sistema de navegação;
- hierarquia visual compatível com Home/Mapa;
- preservação da regra `planned` invisível.

Candidate visual: `dpl_5gDyuPLpEuhPWkaTFkATShRJuMAK`.


## Auth

Checkpoint: `702403c01670c5a6853b21f49f438693f798f550`.

A superfície `/entrar` permanece standalone por design, mas agora usa a mesma linguagem visual do Território Vivo:

- painel territorial;
- explicação clara de leitura pública vs ações privadas;
- benefícios reais da conta: publicar/gerenciar, Favoritos e Mensagens;
- formulários preservam os mesmos Server Actions e contratos de segurança;
- sem mudança em redirects, senha mínima ou validações.

Candidate visual: `dpl_2k8PUJCN1k226jCzjeahW7ym9PEo`.


## Área pessoal e detalhe público

Checkpoint: `4d07ac9f829fbca93409a1effee86ca59be21db2`.

Área pessoal:

- rail único para Meus anúncios, Novo anúncio, Favoritos e Mensagens;
- Favoritos, Mensagens/conversa e Meus/Novo/Editar usam a mesma autoridade visual;
- estados vazios usam NavigationIcon;
- CSS `authCardWide` legado foi removido e possui teste anti-regressão.

Detalhe público de Classificados:

- contexto local explícito;
- galeria e hierarquia de preço refinadas;
- card de negociação mais claro;
- bloco de segurança em alto contraste;
- favoritos, mensagem, denúncia, structured data e lifecycle não foram alterados.

Candidate histórico: `dpl_25zbkdq9xwDSmWcb1NabQHF1x2kD`. O candidate canônico atual é `dpl_8dmirY6fshiZg6EuAr55PGCwii1S`.


## Moderação

Checkpoint: `85df68f43479aa6b25d8d8613bfd66a29809950c`.

A área administrativa de Classificados permanece restrita por role, mas agora acompanha o sistema visual:

- rail contextual com fila pendente e denúncias recentes;
- atalhos internos para revisão e denúncias;
- regra operacional de moderação visível;
- nenhuma alteração em `hasClassifiedAdminRole`, queries ou Server Actions;
- breakpoint Auth legado de 720px removido.

Candidate visual: `dpl_8dmirY6fshiZg6EuAr55PGCwii1S`.


## Loading contextual da área pessoal

Checkpoint: `fa1639244fb30908a48fcf974e33f9b7dc14b7fe`.

Foi criada uma autoridade visual única `AccountSurfaceLoading` com variantes:

- `list`: Favoritos, Mensagens e Meus anúncios;
- `thread`: conversa individual;
- `form`: Novo anúncio e Editar anúncio.

Benefícios:

- mantém App Shell e Account Rail durante navegação;
- não mostra mais skeleton territorial da Home em rotas pessoais;
- reduced-motion preservado;
- wrappers de rota mínimos, sem duplicar o skeleton;
- teste de contrato impede perda do loading contextual.

Candidate visual: `dpl_HZSm3ih3n3wicw8eGPsaF758KVi1`.


## Escopo visual do MVP

Checkpoint: `abc52b42a0b2336d3e0d018b4a4600223da55f84`.

Navegação principal do lançamento:

- Território;
- Mapa;
- Classificados.

Auth, Favoritos, Mensagens, gerenciamento de anúncios e Moderação são suporte do fluxo de Classificados e não competem com a navegação principal.

Community, Alertas, Eventos, Oportunidades e Empresas permanecem `future` no registry. Gastronomia e Mobilidade continuam fora do MVP atual.

Candidate visual: `dpl_D9BqwYuKiQUJToyKUgdZNpePSt8a`.
