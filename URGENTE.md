# URGENTE — Plano Canônico de Execução do Achegue-se

> **Status:** ATIVO  
> **Autoridade:** este documento é a rota canônica de execução do projeto.  
> **Branch de trabalho:** `main`  
> **Última atualização:** 2026-09-07  
> **HEAD técnico de referência:** `3507accecadbf159ad9181e236f24ff4ae42b84c`

---

## 0. Como usar este documento

Este arquivo existe para impedir que o Achegue-se volte a crescer de forma desorganizada, duplicada ou guiada pelo módulo que estiver sendo desenvolvido no momento.

### Regra obrigatória para qualquer nova conversa/IA

Antes de alterar arquitetura, banco, produto ou roadmap:

1. ler este `URGENTE.md`;
2. conferir o HEAD atual da `main`;
3. conferir se este documento ainda descreve o estado real;
4. atualizar este documento quando uma decisão estrutural, fase, blocker ou checkpoint mudar;
5. não iniciar uma fase posterior sem cumprir os critérios de saída da fase atual;
6. registrar ao final de cada checkpoint:
   - HEAD;
   - concluído;
   - provas/testes;
   - blocker;
   - próxima ação;
   - itens que **não devem ser repetidos**.

Se outro documento contradizer este arquivo, **este arquivo prevalece até a contradição ser analisada e resolvida conscientemente**.

---

# 1. Visão do produto

O Achegue-se **não é um marketplace**, não é uma OLX local e não deve ser desenhado ao redor de Empresas ou Classificados.

A definição canônica é:

> **Achegue-se é a camada digital do território — uma plataforma local que conecta moradores ao que acontece, às pessoas, aos lugares, serviços, oportunidades e informações ao redor deles.**

Ou, de forma curta:

> **Tudo que importa no seu bairro, em um só lugar.**

O centro do produto é:

`TERRITÓRIO → DADOS → MAPA → COMUNIDADE → UTILIDADE LOCAL → MÓDULOS`

Os módulos existem **dentro do território**, nunca o contrário.

---

# 2. Estratégia geográfica do MVP

## 2.1 Lançamento inicial

O MVP territorial será concentrado no **Complexo do Nordeste de Amaralina**, em Salvador/BA.

### Territórios iniciais

1. Nordeste de Amaralina;
2. Santa Cruz;
3. Vale das Pedrinhas;
4. Chapada do Rio Vermelho.

### Agrupamento

`Complexo do Nordeste de Amaralina` deve ser modelado como **TerritoryGroup**, não como bairro fictício.

Hierarquia conceitual:

```text
Brasil
└── Bahia
    └── Salvador
        ├── Nordeste de Amaralina
        ├── Santa Cruz
        ├── Vale das Pedrinhas
        └── Chapada do Rio Vermelho

TerritoryGroup
└── Complexo do Nordeste de Amaralina
    ├── Nordeste de Amaralina
    ├── Santa Cruz
    ├── Vale das Pedrinhas
    └── Chapada do Rio Vermelho
```

## 2.2 Expansão

A expansão deve ocorrer somente depois de densidade e readiness suficientes.

Ordem esperada:

```text
Complexo do Nordeste de Amaralina
→ Pituba
→ Itaigara
→ outros bairros de Salvador
→ Região Metropolitana
→ outras cidades da Bahia
→ outras capitais/cidades
→ Brasil
```

**Objetivo:** poucos territórios vivos são melhores que centenas de territórios vazios.

---

# 3. Regra arquitetural principal

A arquitetura deve suportar:

- 4 bairros hoje;
- todos os bairros de Salvador depois;
- milhares de territórios;
- milhões de usuários;
- múltiplos módulos;
- grande volume de conteúdo, mapas e dados públicos;

sem exigir reescrever o Core.

Mas:

> **Não construir microservices, routing complexo, motores de mobilidade ou infraestrutura de escala extrema antes de existir necessidade real.**

Arquitetura preferida:

> **Modular monolith bem separado, PostgreSQL/PostGIS, object storage, cache e jobs assíncronos.**

Extrair serviços somente quando métricas reais justificarem.

---

# 4. Camadas canônicas da plataforma

## 4.1 Platform Foundation

Capacidades transversais:

- configuração;
- autenticação;
- identidade/perfis;
- roles/claims;
- feature flags/rollout;
- auditoria;
- mídia/storage;
- busca;
- moderação;
- notificações;
- jobs;
- cache;
- observabilidade;
- health checks;
- analytics;
- políticas de segurança.

## 4.2 Territory Core

Entidades fundamentais:

- `territories`;
- `territory_groups`;
- `territory_group_members`;
- `territory_boundaries`;
- `territory_facts`;
- `territory_data_sources`;
- readiness/rollout;
- canonical URLs;
- aliases;
- centro/bbox;
- hierarquia geográfica.

O território deve ser reutilizado por todos os módulos.

## 4.3 Territory Data Platform

Responsável por dados públicos e oficiais:

- população;
- área;
- densidade;
- renda quando disponível;
- educação;
- saúde;
- segurança/equipamentos;
- transporte público;
- cultura;
- lazer;
- áreas públicas;
- demais indicadores territoriais.

Toda informação deve possuir:

- fonte;
- referência temporal;
- data de importação;
- versão;
- proveniência;
- qualidade;
- data de última verificação.

**Não armazenar números oficiais sem origem rastreável.**

## 4.4 Geospatial / Map Core

Capacidades:

- PostGIS;
- Polygon/MultiPolygon;
- Point;
- bbox;
- viewport;
- layers;
- markers;
- clustering;
- boundaries;
- consultas espaciais;
- URL state/deep links;
- provider abstraction quando fizer sentido.

### Regra

O mapa consulta apenas o necessário pelo viewport:

`bbox + zoom + layers + territory`

Nunca carregar todos os pontos de um território no navegador.

## 4.5 Content / Social Core

Capacidades reutilizáveis:

- posts;
- comentários;
- reações;
- mídia;
- denúncias;
- moderação;
- follow/interesses;
- notificações.

Comunidade será o primeiro grande consumidor social dessas capacidades.

---

# 5. Regra de dependências

A dependência deve apontar dos módulos para o Core:

```text
modules/classifieds → core/territory
modules/community   → core/territory
modules/events      → core/territory
modules/businesses  → core/territory
```

Nunca:

```text
core/territory → modules/classifieds
```

O Core não deve saber que Classificados, Empresas ou Gastronomia existem.

---

# 6. Regra para criação de novas capacidades

Antes de criar qualquer funcionalidade, responder:

> **Isso pertence ao módulo ou à plataforma?**

Exemplos:

### Deve ser Core

- localização/território;
- upload/mídia;
- mapa;
- autenticação;
- permissões;
- busca base;
- denúncias/moderação base;
- observabilidade.

### Deve ser módulo

- preço de classificado;
- cardápio de restaurante;
- vaga de emprego;
- detalhes específicos de evento;
- lógica específica de empresa.

### Regra adicional

Não generalizar prematuramente.

Uma capability só deve virar abstração genérica quando houver segundo consumidor real ou forte necessidade estrutural comprovada.

---

# 7. Ordem oficial de execução

## FASE 0 — Saneamento arquitetural

**Status:** CONCLUÍDA.

Objetivo: preparar o projeto para crescer sem acumular dívida estrutural.

### Entregas

- [x] mapear arquitetura atual;
- [x] classificar código existente em Core / Data / Module / Shared;
- [x] definir estrutura de diretórios alvo;
- [x] definir contratos de dependência;
- [x] criar ADRs essenciais;
- [x] congelar novos módulos;
- [x] impedir novas duplicações de territorial/map/media/moderation via guardrails de lint;
- [x] revisar documentação existente;
- [x] manter `URGENTE.md` atualizado;
- [x] adaptar roadmap geral à nova arquitetura.

### Critério de saída

Existe um mapa claro de arquitetura e nenhum novo módulo está ditando o Core.

---

## FASE 1 — Territory Core

**Status:** CONCLUÍDA.

### Entregas

- [x] habilitar/confirmar PostGIS no projeto canônico;
- [x] modelar `territories`;
- [x] modelar hierarquia country/state/city/neighborhood;
- [x] modelar `territory_groups`;
- [x] modelar `territory_group_members`;
- [x] modelar `territory_boundaries`;
- [x] modelar centro e bbox/GeoJSON público;
- [x] canonical slugs/`geographic_path`;
- [x] status territorial básico;
- [x] formalizar rollout fail-closed antes de ativação de novos territórios;
- [x] formalizar contrato de readiness; cálculo passa a consumir evidências da FASE 2;
- [x] Salvador como cidade raiz do MVP;
- [x] importar os quatro bairros iniciais;
- [x] criar TerritoryGroup do Complexo;
- [x] validar boundaries;
- [x] índices espaciais GiST;
- [x] RLS/grants adequados;
- [x] tipos TypeScript e contracts/ports;
- [x] smoke de contrato público/RLS;
- [x] catálogo map-ready `security_invoker`.

### Critério de saída

Os quatro bairros podem ser identificados, consultados, relacionados, exibidos e usados como contexto canônico por qualquer módulo.

---

## FASE 2 — Territory Data Platform

**Status:** CONCLUÍDA — baseline de dados públicos do MVP.

### Entregas

- [x] `data_sources`;
- [x] proveniência;
- [x] versionamento;
- [x] pipeline de ingestão reproduzível via probes GitHub Actions + snapshots + ingestion runs;
- [x] staging/validation fail-closed com promoção provisional → verified somente após prova;
- [x] estrutura privada de relatórios/ingestion runs;
- [x] `territory_facts`;
- [x] `public_places`;
- [x] categorias de serviços públicos;
- [x] integração inicial com fontes oficiais;
- [x] população/demografia básica do MVP: população total + domicílios 2022;
- [x] educação: 14 unidades oficiais verificadas espacialmente;
- [x] saúde: 6 unidades com atendimento SUS verificadas espacialmente via CNES atual;
- [x] baseline de equipamentos públicos do MVP: educação + saúde SUS;
- [x] dados públicos essenciais para iniciar Map/Home territorial;
- [x] data quality do baseline: guards, probes, SHA-256 e cross-validation espacial;
- [~] atualização periódica/idempotente: manter como hardening operacional, sem bloquear Map/Home;
- [x] zero dado inventado.

### Fontes prioritárias

Avaliar e validar, entre outras:

- Prefeitura de Salvador / GeoSalvador;
- IBGE / Censo 2022;
- bases municipais/estaduais oficiais;
- outras fontes públicas confiáveis.

### Regra

APIs externas alimentam o Achegue-se por ingestão/ETL.

**Não depender de API pública externa no request do usuário.**

---

## FASE 3 — Map Core v1

**Status:** SOURCE/CI CONCLUÍDO · validação visual no novo deployment pendente.

### Entregas

- [x] arquitetura de Map Core provider-agnostic;
- [x] conceitos úteis do repositório antigo revisados sem copiar legado;
- [x] boundaries dos quatro bairros;
- [x] mapa do Complexo;
- [x] public places;
- [x] layers;
- [x] viewport query;
- [x] bbox query;
- [x] clustering;
- [x] cache HTTP da API por viewport;
- [x] deep links com bbox + zoom + categorias;
- [x] página `/mapa`;
- [x] mini-mapa reutilizável `TerritoryMiniMap`;
- [x] performance mobile: mapa antes da lista, requests canceláveis e consulta apenas do viewport;
- [x] acessibilidade/fallback: lista textual, controles focáveis, reduced motion e estados de erro;
- [ ] revisão visual real no deployment contendo este HEAD.

O alias público ainda aponta para um deployment anterior: em 2026-09-07, `/mapa` retornou 404 no deployment público existente. Isso é um **gate de release/deployment**, não um blocker de arquitetura ou source.

### Layers iniciais

- boundaries;
- public_places;
- alerts;
- events;
- community;
- classifieds;
- businesses quando o módulo existir.

### Fora de escopo neste momento

- routing próprio;
- ETA;
- distance matrix;
- isochrones;
- map matching;
- corridas/motoristas;
- motor complexo de mobilidade.

---

## FASE 4 — Home Territorial

A Home deve deixar de parecer landing page/marketplace genérico.

### Ordem conceitual

1. território atual;
2. “agora no bairro”;
3. mapa;
4. dados/utilidade pública;
5. comunidade;
6. alertas;
7. eventos/oportunidades;
8. Classificados;
9. Empresas quando existir.

### Entregas

- [ ] redesign desktop profissional e organizado;
- [ ] preservar boa experiência mobile;
- [ ] seletor de território;
- [ ] contexto Salvador/Complexo/bairro;
- [ ] dados públicos reais;
- [ ] mini mapa;
- [ ] estado sem comunidade útil;
- [ ] widening controlado para Complexo/Salvador;
- [ ] nenhum dado fictício;
- [ ] nenhuma promessa de feature inexistente.

---

## FASE 5 — Community

Somente depois de Territory + Data + Map + Home base.

### Tipos iniciais

- conversa;
- pergunta;
- ajuda;
- recomendação;
- aviso;
- ocorrência;
- animal perdido/encontrado;
- foto/relato local.

### Entregas

- [ ] posts;
- [ ] comentários;
- [ ] reações;
- [ ] mídia;
- [ ] escopo territorial;
- [ ] moderação;
- [ ] denúncias;
- [ ] follow;
- [ ] feed territorial;
- [ ] paginação;
- [ ] anti-spam;
- [ ] rate limits;
- [ ] políticas de comunidade.

---

## FASE 6 — Alerts + Events + Opportunities

### Alerts

Entidade própria, não apenas post.

Fontes possíveis:

- comunidade;
- prefeitura;
- defesa civil;
- trânsito;
- água;
- energia;
- clima;
- administração.

### Events

- agenda local;
- eventos comunitários;
- culturais;
- esportivos;
- religiosos;
- educacionais.

### Opportunities

- vagas;
- bicos;
- cursos;
- oportunidades locais.

---

## FASE 7 — Reintegração de Classificados ao Core

**Classificados já existe e não será descartado.**

A partir deste ponto ele deixa de usar conceitos territoriais isolados e passa a consumir a plataforma.

### Estado já construído

- Auth;
- RLS;
- Storage;
- rascunho/edição;
- mídia;
- favoritos;
- mensagens;
- denúncias;
- moderação;
- lifecycle;
- admin;
- listagem pública;
- busca;
- detalhe;
- segurança;
- quality gate.

### Trabalho futuro

- [ ] migrar localização para `territory_id`;
- [ ] remover conceitos duplicados de localização;
- [ ] integrar mapa;
- [ ] integrar Home territorial;
- [ ] integrar Community sem gerar spam;
- [ ] manter moderação;
- [ ] validar E2E final.

### Regra atual

**Não adicionar novas features de Classificados**, salvo correção crítica ou trabalho necessário para migração ao Core.

---

## FASE 8 — Empresas / Serviços

Somente depois da plataforma e comunidade estarem maduras.

Empresas deve reutilizar:

- Territory;
- Map;
- Search;
- Media;
- Identity;
- Moderation;
- Community recommendations.

Não criar sistema paralelo de localização, mapa ou avaliações.

---

## FASE 9 — Gastronomia

Gastronomia deve ser uma especialização de Business/Place quando possível.

Exemplo:

```text
Business
└── GastronomyProfile
    ├── restaurant
    ├── bar
    ├── bakery
    ├── cafe
    └── pizzeria
```

Não construir Gastronomia como universo técnico independente.

---

## FASE 10 — Mobilidade

Entrará somente com justificativa de produto.

### Primeiro nível possível

- pontos;
- estações;
- BRT;
- bicicleta;
- vias;
- alertas;
- transporte público.

### Não assumir desde já

- marketplace de motoristas;
- corridas;
- routing engine;
- ETA próprio.

Esses itens equivalem a uma vertical de alta complexidade e exigem validação separada.

---

# 8. Dados públicos e território útil antes de usuários

Um território deve ser útil mesmo com zero posts.

Página territorial mínima deve poder exibir:

- nome;
- cidade/estado;
- boundary;
- área;
- população;
- densidade quando disponível;
- fonte/ano;
- serviços públicos;
- escolas;
- saúde;
- lazer;
- administração;
- mapa;
- território relacionado/grupo.

Depois entram:

- comunidade;
- alertas;
- eventos;
- oportunidades;
- classificados;
- empresas.

### Princípio

> **Dados públicos tornam o território útil. Comunidade torna o território vivo.**

---

# 9. Proveniência obrigatória

Nenhum dado oficial relevante pode existir sem origem.

Modelo conceitual:

```text
data_sources
- provider
- dataset
- source_url
- license
- version
- published_at
- last_checked_at
- ingestion_method
```

```text
territory_facts
- territory_id
- metric
- value
- unit
- reference_year
- source_id
- imported_at
```

Isso deve permitir responder sempre:

> “De onde veio este dado?”

---

# 10. Escalabilidade obrigatória

## Banco

- PostgreSQL;
- PostGIS;
- índices adequados;
- cursor pagination;
- evitar OFFSET em feeds grandes;
- constraints;
- RLS;
- particionamento somente quando métricas reais justificarem.

## Mapas

- query por bbox;
- zoom-aware;
- clustering;
- CDN/cache para boundaries;
- nunca carregar todo o território.

## Conteúdo

- paginação;
- ranking/tempo;
- cache por território;
- rate limiting;
- moderação.

## Assets

- object storage;
- CDN;
- uploads restritos;
- transforms/derivados quando necessário.

## Dados oficiais

- ETL assíncrono;
- staging;
- validação;
- provenance;
- atualização idempotente;
- logs de ingestão.

## Busca

- PostgreSQL inicialmente;
- mecanismo dedicado somente quando volume justificar.

## Jobs

Não executar ingestões pesadas, importações ou agregações dentro de requests web.

---

# 11. Estrutura de código alvo

Direção conceitual:

```text
src/
  app/

  core/
    auth/
    identity/
    territory/
    geospatial/
    map/
    search/
    media/
    moderation/
    notifications/
    observability/

  data/
    sources/
    ingestion/
    provenance/
    quality/

  modules/
    community/
    alerts/
    events/
    opportunities/
    classifieds/
    businesses/
    gastronomy/
    mobility/

  shared/
    ui/
    utils/
    types/
```

Esta estrutura deve ser adotada progressivamente.

**Não fazer big-bang refactor sem necessidade.**

---

# 12. O que reaproveitar do Achegue-se antigo

O repositório antigo pode ser usado como referência técnica, principalmente para:

- Territory Domain;
- TerritoryGroup;
- boundaries dos quatro bairros;
- conceitos geospatial;
- mapa personalizado;
- Map Core/provider abstraction;
- readiness;
- data quality;
- seeds/fontes públicas úteis.

### Regra

**Reaproveitar conceitos e dados validados, não copiar o legado inteiro.**

Antes de importar qualquer código/dado:

1. revisar;
2. confirmar fonte;
3. confirmar licença;
4. confirmar atualidade;
5. adaptar ao novo Core;
6. criar migration/ingestion canônica;
7. testar.

---

# 13. Regras de honestidade do produto

Nunca:

- inventar população;
- inventar avaliações;
- inventar empresas;
- inventar usuários;
- inventar alertas;
- inventar eventos;
- simular localização real sem permissão;
- mostrar módulo futuro como ativo;
- usar dados antigos sem provenance.

O projeto pode usar placeholders visuais de desenvolvimento, mas eles não podem ser apresentados ao usuário como dado real.

---

# 14. Segurança

Princípios já estabelecidos e permanentes:

- autorização server-side com claims confiáveis;
- nunca confiar em `user_metadata` para autoridade;
- admin por claim assinado em `app_metadata`;
- nenhuma service-role/secret key no cliente;
- RLS em tabelas expostas;
- schemas privados fail-closed;
- grants mínimos;
- storage com ownership;
- funções privilegiadas privadas, sem EXECUTE direto quando forem triggers internos;
- callbacks Auth fail-closed;
- redirects internos validados;
- security advisors após DDL;
- smoke/E2E antes de lançamento.

---

# 15. Estado técnico atual

## Repositório

`washingtonmsdj/teste-acheguese`

Branch:

`main`

HEAD técnico validado antes desta atualização documental:

`3507accecadbf159ad9181e236f24ff4ae42b84c`

## Supabase

Projeto canônico:

- nome: `acheguese-v2`;
- ref: `hnuhabsuzaagsjrtyzdo`;
- região: `sa-east-1`.

Projeto legado `acheguese` permanece separado.

## Vercel

Projeto isolado:

- nome: `teste-acheguese`;
- project id: `prj_MUONHjTGLsctNJZ7J1BWB8xzMidj`;
- alias técnico: `teste-acheguese.vercel.app`.

O deployment de produção atualmente publicado é anterior ao Map Core v1. Em 2026-09-07, o alias público ainda retornava 404 em `/mapa`.

Um novo deployment contendo o HEAD atual continua necessário para a revisão visual final e para provar a Surface territorial em produção.

### Blocker operacional conhecido

A conta Vercel Hobby atingiu a cota diária de API deployments.

Reset informado anteriormente:

**2026-09-08 03:23:07 America/Bahia**

Não alterar arquitetura por causa desse blocker temporário.

---

# 16. Estado de Classificados

Classificados é o primeiro vertical técnico já construído, mas **não é mais o eixo arquitetural do produto**.

### Já existe

- Auth;
- Supabase SSR;
- RLS;
- Storage;
- criação/edição;
- mídia;
- favoritos;
- mensagens;
- denúncias;
- moderação;
- admin;
- lifecycle;
- listagem;
- busca;
- detalhe;
- testes;
- health;
- SEO base;
- security hardening.

### Política atual

**CONGELADO PARA NOVAS FEATURES.**

Permitido:

- correção de bug crítico;
- correção de segurança;
- migração necessária para Territory Core;
- ajuste que impeça regressão arquitetural.

---

# 17. Definition of Done antes de iniciar módulos posteriores

## Platform/Territory Foundation

Antes de Comunidade:

- Territory Core funcional;
- quatro bairros importados;
- TerritoryGroup do Complexo;
- boundaries válidos;
- dados públicos essenciais;
- provenance;
- mapa v1;
- Home territorial base;
- segurança e testes.

## Antes de Empresas

- Platform Core estável;
- Territory/Data/Map em produção;
- Community funcional;
- moderação reutilizável;
- padrões de Media/Search definidos.

## Antes de Gastronomia

- Business/Places Core estável;
- Gastronomia pode ser especialização e não duplicação.

## Antes de Mobilidade complexa

- necessidade validada;
- escopo separado;
- arquitetura/mapa não contaminados por antecipação.

---

# 18. Territory Readiness

Cada território deve possuir readiness mensurável.

Checklist conceitual:

- boundary;
- centro/bbox;
- fonte oficial;
- população;
- principais dados públicos;
- serviços públicos;
- mapa;
- URLs;
- zero dados fictícios;
- qualidade;
- moderação/rollout.

Exemplo:

```text
Nordeste de Amaralina — READY
Santa Cruz — READY
Vale das Pedrinhas — READY
Chapada do Rio Vermelho — READY
Pituba — DATA PREPARATION
```

Não liberar território incompleto como se estivesse pronto.

---

# 19. Critérios de STOP

Interromper e corrigir antes de avançar se ocorrer:

- segundo sistema de território;
- segundo sistema de mapa;
- segundo sistema de autenticação;
- segundo sistema de moderação sem justificativa;
- módulo criando sua própria geografia;
- dado público sem fonte;
- dado fictício visível como real;
- bypass de RLS;
- admin por metadata editável;
- secret no cliente;
- API externa crítica no request síncrono;
- feed/mapa carregando dataset inteiro;
- nova feature de Classificados fora da política de congelamento;
- Empresas/Gastronomia/Mobilidade iniciadas antes da fundação.

---

# 20. Próxima ação canônica

A próxima frente continua não sendo Community, Empresas, Gastronomia ou Mobilidade.

## Próximo passo

> **Iniciar FASE 4 — Home Territorial em source, consumindo somente dados reais já verificados e o mini-mapa reutilizável, enquanto a revisão visual de produção do Map Core permanece como gate paralelo de deployment.**

Sequência imediata:

1. criar/readaptar o adapter server-side da Home sobre `territory_fact_catalog`, `public_place_catalog` e boundaries canônicos;
2. apresentar contexto do Complexo e dos quatro bairros sem alterar rollout — todos permanecem `data_preparation`;
3. substituir a Home genérica/marketplace-first por uma experiência território-first;
4. mostrar métricas públicas reais com fonte/ano;
5. integrar `TerritoryMiniMap` e deep link para `/mapa`;
6. criar estado útil para ausência de Community, sem inventar posts, alertas, eventos ou usuários;
7. preservar mobile-first e elevar o desktop para uma composição editorial/profissional;
8. passar lint + TypeScript + testes + build + bundle;
9. quando a cota Vercel permitir, publicar o HEAD atual e executar revisão visual real de `/mapa` e da nova Home.

### Regra de avanço

A FASE 4 pode avançar em source/CI sem depender do blocker temporário da Vercel. O produto territorial, porém, não será declarado **release-validado** até existir novo deployment e inspeção visual da Surface.

---

# 21. Checkpoint atual

### HEAD técnico de referência

`3507accecadbf159ad9181e236f24ff4ae42b84c`

### Fase

**FASE 0 concluída · FASE 1 concluída · FASE 2 baseline MVP concluída · FASE 3 source/CI concluída · FASE 4 é a próxima frente de código.**

### Concluído recentemente

- Censo 2022: 12 fatos verificados e públicos para os quatro bairros;
- educação: 14 escolas oficiais verificadas por geometria/PostGIS;
- saúde: fonte atual do CNES validada, 52 estabelecimentos encontrados no Complexo e 6 unidades com atendimento SUS promovidas para a camada de utilidade territorial;
- distribuição SUS: Nordeste de Amaralina 2, Santa Cruz 1, Vale das Pedrinhas 3 e Chapada do Rio Vermelho 0;
- `territory_fact_catalog` e `public_place_catalog` com provenance;
- Map Core provider-agnostic e queries PostGIS por bbox/viewport;
- contrato público provado com 4 boundaries e 20 locais — 14 educação + 6 saúde SUS;
- MapLibre GL JS 6.7.0 fixado no lockfile;
- OpenFreeMap como provider padrão, sem acoplar o Core ao fornecedor;
- `/mapa` com layers, filtros, clustering, request cancellation, lista textual, cache HTTP e fallback de configuração;
- deep links preservam bbox, zoom e categorias;
- bug que sobrescrevia o zoom do deep link com `fitBounds` foi removido;
- UX mobile reorganizada para mostrar o mapa antes da lista de resultados;
- lista de locais agora pode focalizar pontos no mapa por controle acessível;
- reduced motion respeitado nas animações de navegação;
- mini-mapa reutilizável `TerritoryMiniMap` criado sobre os mesmos contratos do Map Core;
- CI do commit `3507acce`: lint, TypeScript, testes e build **PASS**;
- `vercel-source-bundle` do commit `3507acce`: **PASS**;
- Supabase security advisors: **0 lints**;
- os quatro bairros e o Complexo continuam em `data_preparation`; nenhum território foi lançado por acidente.

### Blocker de release

- o deployment público atual é anterior ao Map Core v1;
- em 2026-09-07, `https://teste-acheguese.vercel.app/mapa` ainda retornava 404;
- a conta Vercel Hobby permanece sob o blocker temporário de cota já registrado, com reset informado para **2026-09-08 03:23:07 America/Bahia**;
- não criar workaround arquitetural para contornar esse limite.

### Próxima ação

**FASE 4 — Home Territorial: dados reais + contexto territorial + mini-mapa + estados vazios honestos, seguida de CI e revisão visual no primeiro deployment disponível.**

### Não repetir

- não reiniciar Censo, Educação ou CNES já verificados;
- não inferir território por rótulo textual de bairro; geometria/PostGIS é autoridade;
- não usar a camada municipal de saúde de 2022 como atual;
- não reintroduzir C002/C003/C004/C018 sem semântica/unidade comprovadas;
- não carregar dataset inteiro no navegador;
- não quebrar o contrato de deep link do mapa;
- não lançar os territórios antes do readiness/rollout explícito;
- não iniciar Empresas/Gastronomia/Mobilidade;
- não aprofundar Classificados;
- não criar Community antes da Home territorial base;
- não inventar posts, alertas, eventos, avaliações, empresas ou usuários;
- não fazer requests críticos a APIs públicas externas no request do usuário.

---

# 22. Template obrigatório de atualização

Ao final de cada checkpoint importante, atualizar esta seção ou acrescentar novo checkpoint:

```text
Data:
HEAD:

FASE:
Status:

Concluído:
- ...

Provas:
- CI:
- Supabase advisors:
- smoke/E2E:
- deployment:

Blockers:
- ...

Next action:
- ...

Do not repeat:
- ...
```

---

# 23. Regra final

> **O Achegue-se deve crescer adicionando módulos a uma plataforma territorial organizada — nunca adicionando mini-sistemas independentes que depois precisem ser costurados.**

A prioridade atual é construir a fundação que permita Comunidade, Alertas, Eventos, Classificados, Empresas, Gastronomia e Mobilidade chegarem ao lugar correto sem bagunçar o projeto.
