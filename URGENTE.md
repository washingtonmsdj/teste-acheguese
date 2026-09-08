# URGENTE — Plano Canônico de Execução do Achegue-se

> **Status:** ATIVO  
> **Autoridade:** este documento é a rota canônica de execução do projeto.  
> **Branch de trabalho:** `main`  
> **Última atualização:** 2026-09-08  
> **HEAD técnico de referência:** `e735797b8f64947de13855cf8cf8c285e16435fa`

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

# 2A. Escopo funcional do MVP

O lançamento inicial deve permanecer deliberadamente pequeno e completo.

## Superfícies principais

- **Território/Home** — entrada e contexto do Complexo/bairro;
- **Mapa** — bairros, Educação e Saúde/SUS com dados oficiais;
- **Classificados** — serviço local já existente e incluído no MVP.

## Suporte operacional

- Auth;
- Favoritos;
- Mensagens;
- Meus anúncios / Novo / Editar;
- Moderação administrativa.

Essas superfícies suportam o fluxo de Classificados e não são novos módulos independentes do produto.

## Fora do MVP atual

- Community;
- Alertas;
- Eventos;
- Oportunidades;
- Empresas;
- Gastronomia;
- Mobilidade.

No registry, `releaseScope: 'mvp'` é a autoridade técnica. Um módulo futuro não pode aparecer apenas mudando `availability`; precisa ser promovido conscientemente de escopo e passar pelos gates da fase correspondente.

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
- [x] guard de abuso em duas camadas: zoom local + bbox máximo no Core/API e bbox máximo dentro das RPCs públicas;
- [x] migrations `20260907102052_map_bbox_abuse_guards_v1` e `20260907102801_map_rpc_category_guards_v1` alinhadas entre Supabase e Git;
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

**Status:** MVP SOURCE/CI CONCLUÍDO · revisão visual no novo deployment pendente.

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

- [~] redesign desktop profissional e organizado — conceito canônico **Território Vivo** materializado e refinado até `a74679aac8b2e6d52ad853044ef6e2e4ac873644`, com sidebar + toolbar + conteúdo + rail contextual, hero/mapa lado a lado em desktop útil e maior contraste entre seções; revisão visual real no deployment ainda pendente;
- [~] preservar boa experiência mobile — navegação mobile, Home, Mapa e loadings refinados em source; módulos futuros permanecem ocultos por registry até a fase correspondente; revisão visual real pendente;
- [x] seletor de território Complexo ↔ quatro bairros;
- [x] contexto Salvador/Complexo/bairro;
- [x] dados públicos reais agregados sem soma parcial silenciosa;
- [x] mini mapa reutilizando o Map Core;
- [x] deep link Home → mapa preservando bbox/zoom/camadas do escopo selecionado;
- [x] estado sem comunidade útil e explícito;
- [~] widening controlado bairro → Complexo concluído; Salvador aguarda readiness/dados próprios;
- [x] nenhum dado fictício;
- [x] nenhuma promessa de feature inexistente;
- [x] menu e busca genérica limpos de Empresas/Gastronomia/categorias futuras;
- [x] adapter territorial com leitura em lote para evitar N consultas por bairro;
- [x] snapshot público da Home com Data Cache por escopo, TTL de 60 segundos alinhado ao rollout/SEO, sem tocar Auth/Classificados;
- [x] parâmetros de bairro malformados rejeitados antes do cache e bairro fora do grupo rejeitado antes das consultas pesadas;
- [x] runtime fail-closed: falha inicial do mapa vira estado seguro, não 500 nem dado fictício;
- [x] SEO fail-closed por rollout: Home/Mapa só indexam em `public_preview` ou `launched`, e falha de leitura do rollout degrada para não público sem derrubar metadata/sitemap;
- [x] canonical global removido; Classificados possui canonical próprio;
- [x] rota placeholder `/empresas` removida;
- [x] observabilidade server-side estruturada/redigida em Home, Mapa/API e Health;
- [x] health canônico exige Territory Core + canário de Classificados;
- [x] source closure Vercel manifestada e testada, incluindo o script de worker MapLibre e excluindo `.env`;
- [x] gate de pré-deploy fail-closed versionado: checkout local, `main`, `deploy/vercel-bundle/SOURCE_SHA`, `quality` e `vercel-source-bundle` precisam apontar para o mesmo HEAD aprovado;
- [x] allowlist obsoleta de imagens Unsplash removida;
- [x] 35 classes globais marketplace órfãs removidas; comparação automática atual = 0 classes globais órfãs;
- [x] lint + TypeScript + testes + build + bundle;
- [ ] revisão visual real da Home e do mapa no deployment contendo este HEAD.

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

### Decisão canônica

**Continuar a v2 como base principal. Não voltar o desenvolvimento do produto para o repositório original e não criar um terceiro repositório.**

Repositórios:

- **canônico / linha ativa:** `washingtonmsdj/teste-acheguese`;
- **legado donor/reference:** `washingtonmsdj/acheguese`.

O original passa a ser **donor/reference**. O mapa detalhado de reaproveitamento fica em `docs/LEGACY-DONOR-MAP.md`.

### Instrução obrigatória para futuras IAs/agentes

Ao iniciar uma nova conversa ou sessão:

1. tratar `washingtonmsdj/teste-acheguese` como a única base de implementação ativa;
2. trabalhar na `main` da v2, salvo instrução explícita posterior em contrário;
3. **não** retomar novas features no repositório original;
4. **não** fazer dual-write ou manter duas implementações vivas do mesmo domínio;
5. **não** criar um terceiro repositório para “recomeçar melhor”;
6. consultar o original somente quando a fase atual pedir uma capacidade já existente;
7. ao reaproveitar algo do original, migrar seletivamente contrato/regra/teste/dado validado, adaptando ao Core v2;
8. registrar provenance/origem quando código, migration, teste ou dado materialmente vier do original;
9. preservar as autoridades já canônicas da v2 — especialmente Territory, Map, Auth, rollout, provenance e Classificados;
10. qualquer consolidação/rename de repositórios só pode ser considerada **depois da FASE 4 release-validada em deployment real**.

### Regra de STOP para esta decisão

Interromper a execução se uma proposta implicar:

- voltar a desenvolver o produto principal no original;
- copiar módulos inteiros sem auditoria;
- importar migrations antigas em massa;
- reintroduzir geografia, Auth, mapa, moderação ou SSOT paralelo;
- renomear/consolidar repositórios antes do gate de release da FASE 4.

Nesses casos, preservar a v2 e seguir a estratégia donor/reference.

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

**Reaproveitar conceitos, contratos, testes e dados validados; não copiar o legado inteiro.**

O original já contém capacidades maduras de Community, Messaging, Notifications, Moderation/Trust, Search, Media, Business, Gastronomia, Mobilidade e Billing. Elas devem ser estudadas somente quando a fase correspondente da v2 chegar, preservando Territory/Auth/Map e demais autoridades já canônicas da v2.

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

`280ae396d69e60b3ab932c87798ac730ffdf23b2`

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

A fundação territorial, Map Core e frontend Território Vivo estão fechados em source/CI para o escopo atual. O source técnico avançou após o último candidate por hardening de development config; portanto o candidate listado abaixo é histórico até um novo deployment source-aligned ser gerado.

## Candidate source-aligned atual

- source/runtime: `e735797b8f64947de13855cf8cf8c285e16435fa`;
- deployment: `dpl_5C6SdRtv7GBzfa7TcUpGXtitvaZ5`;
- preview protegido: `https://teste-acheguese-7ks0frtai-jogo-brasils-projects.vercel.app`;
- Vercel: **READY**;
- build: `public_env=PASS mode=production required=yes supabase=configured`;
- compile/TypeScript/static generation: PASS;
- quality: `34217026909` PASS;
- source bundle: `34217026860` PASS;
- runtime errors observados: **0**;
- uma leitura real da Home chegou ao aplicativo com **HTTP 200**;
- Home usa dados oficiais e reutiliza o mesmo payload para o mini-mapa, sem segunda RPC;
- fallback público é user-facing e fail-closed, sem números fictícios;
- escopo territorial do release possui uma autoridade compartilhada, sem lista duplicada no componente;
- Classificados, Auth, conta, moderação, formulários, mensagens e detalhe público permanecem alinhados ao Território Vivo.

O candidate usa somente as três variáveis públicas necessárias em configuração efêmera de deployment. Nenhum secret/service-role foi versionado ou enviado ao cliente.

## Gate ainda pendente

A Deployment Protection/SSO continua impedindo uma sessão automatizada persistente para todas as rotas. Portanto ainda **não** marcar como PASS:

1. `territory-release-smoke` completo no candidate;
2. revisão visual real 1440×900;
3. revisão visual real 390×844;
4. callback Auth exata do candidate;
5. E2E Auth/Classificados.

Não remover Deployment Protection, RLS, CSP ou outros guards para contornar esse gate.

## Próxima ação

> **Preservar `dpl_5C6SdRtv7GBzfa7TcUpGXtitvaZ5` → abrir em sessão Vercel autenticada persistente → executar smoke completo + revisão visual desktop/mobile → adicionar somente a callback Auth exata → executar E2E Auth/Classificados → corrigir somente defeitos observados → fechar FASE 4.**

### Regra de avanço

**Não iniciar Community, Empresas, Gastronomia ou Mobilidade antes do gate visual/runtime/E2E da FASE 4.**

---
# 21. Checkpoint atual

### HEAD técnico de referência

`6329bb61599bdcce49c5b1a2cde3c8c734237251`

> Este SHA identifica o último commit com mudança de source/runtime. Commits posteriores somente de documentação/governança podem existir na `main`; para release, sempre validar o HEAD real e `deploy/vercel-bundle/SOURCE_SHA` imediatamente antes do deployment.

### Fase

**FASE 0 concluída · FASE 1 concluída · FASE 2 baseline MVP concluída · FASE 3 source/CI + security hardening concluídos · FASE 4 MVP source/CI + performance/SEO/runtime/observability hardening concluídos · validação visual/runtime em deployment pendente.**

### Concluído recentemente
- dev public config `6329bb61`: `npm run dev` agora falha antes do Next quando a configuração pública obrigatória do Supabase está ausente; `territory.home.config_unavailable` deixa de ser tratado como erro de aplicação em development e vira warning estruturado para sessões já abertas; CI continua podendo buildar sem env e Vercel permanece fail-closed; quality `34223146308` + bundle `34223146374` = PASS;

- Home território-first continua alimentada somente por fatos/lugares oficiais;
- Data Cache da Home está em **60 segundos**, alinhado à visibilidade de rollout/SEO;
- parâmetros `?bairro=` malformados são rejeitados antes do cache;
- bairro canônico fora do TerritoryGroup é rejeitado antes das consultas pesadas;
- falha de carregamento inicial do mapa retorna estado seguro, nunca dados de demonstração;
- leitura de rollout usada por metadata/sitemap agora é **fail-closed também em erro de Supabase**;
- resolver real de visibilidade possui testes para `data_preparation`, `internal_preview`, `paused`, `public_preview` e `launched`;
- Home/Mapa permanecem `noindex` enquanto rollout não for público;
- canonical global foi removido e Classificados mantém canonical próprio;
- raw viewport exige zoom >= 10, bbox <= 2° e até 10 category keys canônicas;
- os mesmos guards de bbox/categorias existem nas RPCs públicas PostGIS, impedindo bypass direto ao Supabase;
- migrations remotas/Git alinhadas até `20260907130331_classified_favorites_publication_guard_v1`;
- smoke válido preservado: **4 boundaries + 20 locais**, inclusive com role `anon`;
- health endpoint passou a exigir canário do Territory Core + Salvador/Classificados;
- observabilidade server-side estruturada foi adicionada sem stack/contexto arbitrário e com redaction de keys/JWT;
- bundle Vercel agora possui manifesto de source closure e teste contra omissão de lifecycle scripts;
- pré-deploy agora possui gate executável fail-closed (`npm run release:preflight`) que impede candidate com checkout, `main`, transport branch ou workflows divergentes;
- frontend **Território Vivo** foi materializado estruturalmente e consolidado: App Shell adaptativo com sidebar desktop, toolbar contextual, rail lateral e registry único; Home, Mapa, Busca, Classificados público/detalhe, Favoritos, Mensagens, Meus/Novo/Editar anúncio e Moderação usam a mesma arquitetura global; `SiteHeader` legado e CSS correspondente foram removidos; módulos futuros `planned` seguem ocultos até suas fases; quality run `34189520702` e bundle run `34189520634` = PASS; decisão visual detalhada em `docs/FRONTEND-TERRITORIO-VIVO.md`;
- bottom navigation também deriva do registry único; Community já possui posição mobile preparada, mas permanece `planned` e invisível; não existe lista paralela de destinos mobile;
- frontend territorial foi refinado no source: Home agora prioriza utilidade do morador, mapa, dados e bairros; cabeçalho e tabbar mobile ganharam navegação visual consistente; Mapa ganhou filtros e lista de locais mais claros; menu, loading global, 404, erro e Busca foram alinhados ao mesmo sistema visual; `/mapa` e `/classificados` agora possuem loading states próprios que preservam o layout da rota e reduced-motion; copy de roadmap/MVP foi removida das superfícies públicas e protegida por teste de contrato; nenhum schema/API/rollout mudou; quality run `34180676875` e bundle run `34180676868` = PASS.
- refinamento visual desktop `a74679aa`: em 1360px+ a Home usa hero + mapa lado a lado mesmo com rail; rail contextual alinha à toolbar; busca/topbar ganharam hierarquia tipográfica melhor; bloco de dados públicos virou seção de alto contraste; rail da Home ganhou cartão territorial de destaque; mobile mantém a arquitetura existente; quality e bundle do commit = PASS.
- hardening de interação `f7fe2080`: alvos de toque principais normalizados para ~44px+ no menu mobile, seletor territorial, links do rail, conta desktop e controles/lista do Mapa; quality + bundle = PASS.
- densidade mobile `299ad9a1`: heroes internos, formulários e espaço seguro acima da bottom navigation foram refinados para telas pequenas sem alterar lógica/API;
- fechamento de touch targets `bab5273b`: menu/fechar e rail de Classificados passaram a respeitar alvo ~44px; quality `34195671855` + bundle `34195671848` = PASS;
- Busca/Menu `7209f824`: Busca virou hub territorial com separação explícita entre Mapa e Classificados; Menu ganhou contexto territorial e ícones consistentes; nenhuma busca universal fictícia ou módulo `planned` foi exposto; quality `34197469384` + bundle `34197469380` = PASS;
- Auth `702403c0`: tela de entrada alinhada ao Território Vivo com contexto territorial e benefícios reais da conta; `signInAction`, `signUpAction`, redirects e validações permaneceram inalterados; quality `34198106553` + bundle `34198106554` = PASS;
- Account rail `9460231b`: criado rail único de área pessoal e removido CSS Auth legado que podia sobrescrever o novo visual;
- superfícies de conta `d7dfe744` + `f0c68f67`: Favoritos, Mensagens, conversa, Meus/Novo/Editar anúncios usam o mesmo rail contextual;
- account guard `036b7379`: estados vazios usam o sistema de ícones e teste impede retorno de `authCardWide`/perda do rail;
- detalhe público `4d07ac9f`: galeria, contexto local, preço/ações e bloco de segurança alinhados ao Território Vivo; quality `34200899658` + bundle `34200899596` = PASS;
- moderação `85df68f4`: rail administrativo com contagem real de fila/denúncias e atalhos; breakpoint Auth legado de 720px removido e protegido por teste; quality `34201520319` + bundle `34201520421` = PASS;
- Home product-first `d148ef3e`: hero simplificado para MVP, badge de rollout removido do fluxo principal, mapa lado a lado já em 1180px+, seletor territorial compacto, utilidades/copy orientadas a ação e Classificados tratado como serviço local; teste `territory-home-product-contract` protege composição; quality `34207533838` + bundle `34207533752` = PASS;
- loading Home `e82526be`: skeleton global passou a reservar o rail contextual e adotar o mesmo breakpoint de 1180px da Home real, reduzindo layout shift; teste de contrato cobre rail + breakpoint; quality `34207533838` + bundle `34207533752` = PASS;
- formulários Classificados `d4f8bcbc`: Novo/Editar passaram a agrupar conteúdo, preço/condição, descrição e localização sem alterar nomes de campos ou Server Actions; Novo exibe fluxo rascunho → fotos → revisão;
- contrato de formulário `6bbb24b6`: teste garante os sete campos canônicos, `createClassifiedDraftAction`, `updateAction`, bloqueio `disabled={!editable}` e fluxo de revisão; quality `34213809448` + bundle `34213809447` = PASS;
- resumos de conta `df70b85e`: Meus anúncios, Favoritos e Mensagens exibem métricas derivadas dos dados já carregados, sem consultas adicionais;
- guard de resumos `f48a89fe`: teste prova que as métricas permanecem sem segunda query nas superfícies principais;
- conversa `6d720e2e`: thread mostra papel, status do anúncio, contagem de mensagens, estado vazio e composer mais explícito; as queries e limites de mensagem foram preservados; quality `34214797945` + bundle `34214797952` = PASS;
- Classificados browse `3d24f3e9`: copy e cards orientados a tarefa, com condição/local/CTA explícitos;
- Home resiliente `f8da161e`: mini-mapa passa a reutilizar fatos/places já carregados, eliminando segunda leitura RPC; fallback preserva estrutura territorial sem inventar números;
- fallback público `fe5aefb6`: removida linguagem interna de MVP da UI e contrato de copy passou a bloquear `MVP territorial`, `Estrutura do MVP` e `Fundação do MVP`;
- smoke Home `7262b568` + `59c95b4e`: release smoke exige 68.357 pessoas, 30.642 domicílios, 20 locais, 14 Educação e 6 SUS e falha fechado se a Home cair em fallback;
- territory release scope `b260d75a`: cidade, grupo e quatro bairros passaram a ter uma autoridade compartilhada em `src/config/territory-release-scope.ts`; Home fallback, loader, rollout visibility e health deixaram de duplicar slugs;
- contrato release scope `e735797b`: testes validam a autoridade compartilhada sem reintroduzir hardcode no componente; quality `34217026909` + bundle `34217026860` = PASS;
- payload atual contém o `scripts/copy-maplibre-worker.mjs` e **0 arquivos .env**;
- allowlist obsoleta `images.unsplash.com` foi removida;
- `package.json` declara ESM explicitamente; os warnings `MODULE_TYPELESS_PACKAGE_JSON` foram eliminados sem alterar arquivos CommonJS, pois o repositório não possui `.js/.cjs`;
- CSS global da antiga landing/marketplace foi auditado contra todo `src/**`: **35 seletores órfãos removidos, 0 classes globais órfãs restantes**;
- auditoria de rotas confirmou somente **14 páginas + 4 route handlers** no App Router;
- `POST /auth/signout` passou a exigir Origin canônica/confiável, fechando logout-CSRF;
- cadastro/login/logout e callback Auth exigem origem explícita confiável; produção aceita somente a `NEXT_PUBLIC_SITE_URL` canônica ou a `VERCEL_URL` exata do deployment atual fornecida pelo runtime Vercel; nenhum wildcard `*.vercel.app` é aceito; dev sem essas autoridades continua restrito a localhost HTTP;
- `safeInternalPath` foi endurecido contra separators/backslash/controles percent-encoded e dupla codificação no pathname, preservando encoding legítimo em query;
- prova local de canonicalização confirmou fallback `/` para `%2F%2F`, `%5C`, dupla codificação e CRLF codificado, mantendo query `%2F` legítima intacta;
- smoke pós-deploy agora prova também que `Origin: BASE_URL` do candidato é reconhecida como origem Auth confiável, enquanto ausência de Origin continua 403;
- runbooks exigem Site URL oficial fixa + redirect callback exata do candidato no Supabase Auth, removida depois quando não for mais necessária;
- adapter SSR/proxy foi revisado contra o padrão oficial atual do `@supabase/ssr 0.12.6`: clients por request, `getClaims()`, refresh de cookies e propagação dos cache headers privados; nenhuma instância server-side global foi encontrada;
- `robots.txt` bloqueia explicitamente `/api/` e `/menu` além das superfícies privadas já existentes;
- smoke pós-deploy automatizado foi adicionado em `scripts/territory-release-smoke.mjs` e cobre health, headers, robots/sitemap, Home Complexo + 4 bairros, noindex/index, redirects inválidos, Map API 4/20/14/6, abuse guards e signout Origin;
- ferramenta de smoke fica fora do payload Vercel; o worker MapLibre obrigatório continua dentro;
- CI agora executa `npm audit --omit=dev --audit-level=high`; lock atual retornou **0 vulnerabilidades de produção**;
- CI também executa `npm run security:scan`, bloqueando `.env` real, arquivos de chave privada e padrões de credencial de alta confiança antes de lint/typecheck/build;
- secret scan da árvore rastreada atual retornou **PASS**; único `.env*` versionado é `.env.example`; nenhuma chave/arquivo sensível de alta confiança foi encontrado;
- esse scanner cobre a árvore atual, não prova sozinho todo o histórico Git; Secret Scanning alerts/histórico não são expostos pela integração conectada e devem ser verificados administrativamente antes do lançamento público;
- Next.js permanece em `16.3.4`, acima dos patches críticos de agosto de 2026;
- warning de `unrs-resolver` foi rastreado até `eslint-import-resolver-typescript` e é **dev-only**; nenhum postinstall transitivo foi aprovado às cegas;
- requests de viewport do Map Core agora reutilizam o bbox/zoom normalizado do deep link, reduzindo cardinalidade de cache CDN;
- CSP sem nonce + HSTS adicionados no `next.config`, preservando cache/static behavior;
- CSP continua provider-agnostic: origem do style customizado entra automaticamente e origens extras podem ser declaradas explicitamente em `NEXT_PUBLIC_MAP_CSP_ORIGINS`;
- allowlist de `next/image` agora deriva do `NEXT_PUBLIC_SUPABASE_URL` e aceita somente signed Storage paths;
- bucket `classified-media` validado: privado, 8 MB, JPEG/PNG/WebP/AVIF;
- policies do Storage validadas: upload/delete somente pelo owner autenticado; leitura pública apenas para anúncio publicado ou pelo próprio owner;
- banco v2 validado sem conteúdo fictício transacional: **0 users Auth, 0 classificados, 0 mídias, 0 favoritos, 0 conversas, 0 mensagens e 0 denúncias**;
- seeds legítimos preservados: Salvador/BA ativo + 8 categorias estruturais de Classificados;
- smoke RLS anônimo canônico executado no banco real e **PASS**: Salvador público, anon sem INSERT de classificados e sem EXECUTE nas RPCs de submit/withdraw;
- smoke RLS autenticado/admin rollback-safe executado no banco real e **PASS**: owner cria draft/mídia e envia para revisão, não se autopublica, outro usuário não lê/altera, `user_metadata` não concede admin, owner com claim admin não modera o próprio anúncio, admin externo não altera conteúdo e consegue aprovar com receipt canônico;
- `supabase/smoke/authenticated-rls.sql` foi versionado como prova repetível; runbook distingue claramente smoke transacional de E2E Auth real;
- os dois smokes canônicos foram executados **diretamente do conteúdo versionado no Git** e ambos retornaram PASS; authenticated smoke terminou com `auth_users_after=0`, `classifieds_after=0`, `media_after=0`, `moderation_after=0`;
- os smokes SQL permanecem fora do bundle Vercel; são ferramentas de prova, não runtime de produção;
- performance advisor Supabase revisado no pré-deploy: somente findings `unused_index` em nível INFO, sem sinais de performance críticos; nenhum índice removido sem tráfego real;
- fontes oficiais Censo/Educação/CNES foram revalidadas no run `34155391384`: hashes normalizados e contagens continuam idênticos às receipts promovidas; decisão explícita **NO DB MUTATION / NO MIGRATION / NO ROLLOUT CHANGE**;
- receipt de revalidação registrada em `docs/data/receipts/2026-09-07-territory-source-revalidation.md`;
- auditoria de policies/grants confirmou escrita anônima = zero e transições owner/admin protegidas por trigger;
- inventário global de grants/RPCs confirmou: `anon` SELECT-only em tabelas públicas, `authenticated` escreve somente no domínio Classificados, schema `private` sem USAGE/CREATE para clients e nenhuma função `SECURITY DEFINER` executável por `anon/authenticated`;
- `supabase/smoke/grants-contract.sql` versionado para detectar ampliação futura de grants/RPCs/search_path;
- unicidade de denúncias confirmada por constraint `UNIQUE (classified_id, reporter_id)`;
- unicidade de conversa confirmada por constraint `UNIQUE (classified_id, buyer_id)` + `buyer_id <> seller_id`;
- favoritos foram alinhados ao mesmo contrato temporal de publicação: `status='published'` + `published_at <= now()`;
- migration `20260907130331_classified_favorites_publication_guard_v1` aplicada e versionada;
- 7 superfícies pessoais/admin são explicitamente `force-dynamic`, independentemente de env/build inference;
- build confirmou `ƒ` para admin, edição/meus/novo, favoritos e mensagens;
- rotas protegidas recebem `Cache-Control: private, no-store, max-age=0, must-revalidate`;
- smoke de release passou a exigir `private/no-store` em `/entrar`; o cache público do Map API permanece separado;
- erro real de navegador `Invalid supabaseUrl` foi reproduzido a partir do log e corrigido na autoridade central de configuração;
- `NEXT_PUBLIC_SUPABASE_URL` agora é validada como HTTP/HTTPS antes de qualquer `createClient`; valores malformados ficam fail-closed e não derrubam metadata/Home;
- Home não registra configuração ausente/malformada como exceção de runtime; mantém o estado indisponível controlado;
- `.env.example` aponta para a URL pública canônica do projeto `acheguese-v2`, mantendo somente a publishable key fora do Git;
- `manifest.webmanifest` deixou de usar a descrição marketplace-first e agora segue o posicionamento territorial;
- erro real `/favicon.ico 404` corrigido com `public/favicon.svg`, metadata explícita e redirect compatível;
- preflight de env pública executa antes de `dev` e `build`, lendo `.env`, `.env.<mode>`, `.env.local` e `.env.<mode>.local` com precedência compatível;
- se qualquer variável Supabase estiver presente, URL + publishable key passam a ser obrigatórias como par completo;
- URL Supabase e `NEXT_PUBLIC_SITE_URL` agora aceitam somente origem HTTP/HTTPS canônica, sem path/query/hash/credenciais;
- provider de mapa customizado também é validado antes de subir dev/build;
- preflight não imprime valores de credencial e continua permitindo CI sem configuração pública;
- scripts do preflight foram incluídos na source closure Vercel e o contrato de lifecycle continua protegido por teste;
- `npm run env:check` foi adicionado como diagnóstico explícito para setup local antes de `npm run dev`;
- README agora documenta setup local seguro com `.env.local`, sem versionar credenciais;
- Supabase v2 possui chave moderna `sb_publishable_...` ativa, além da legacy anon; o release deve usar a publishable moderna;
- `docs/CLASSIFIEDS-MVP.md` foi atualizado para o estado real: Supabase/RLS/Storage já existem e Classificados não autoriza iniciar Empresas;
- tentativa inicial de favicon binário revelou que o bundle inline é textual; o binário foi removido e o source closure permaneceu no protocolo canônico em vez de criar segundo mecanismo de upload;
- HEAD técnico `2e5cc7d7`: audit produção, lint, TypeScript, testes e build **PASS**;
- `vercel-source-bundle` do HEAD técnico `2e5cc7d7`: **PASS**;
- branch `deploy/vercel-bundle` é atualizada automaticamente a cada commit da `main`; antes do deployment, exigir `SOURCE_SHA == main HEAD` em vez de confiar em SHA documental estático;
- Supabase security advisors: **0 lints**;
- nenhum rollout territorial foi alterado.

- repository governance versionada em `docs/REPOSITORY-GOVERNANCE.md`;
- `SECURITY.md`, Dependabot e CODEOWNERS adicionados ao repositório canônico;
- GitHub branches API confirmou `main.protected = false`; Rulesets continua com coleção vazia; endpoint clássico de branch protection permanece inacessível à integração por falta de permissão administrativa (403); portanto a `main` está **confirmadamente sem proteção administrativa ativa exposta pelo GitHub neste checkpoint**;
- issue **#6 — Governança — habilitar proteção administrativa da main** criada e atribuída ao owner para rastrear essa ação externa até fechamento;
- issue **#1 — Home / Discovery shell** fechada como superseded para impedir retomada da Home marketplace-first;
- issue **#2** foi reescrita como **FASE 4 — Classificados E2E / release gate** e não decide mais a sequência de módulos;
- enquanto a issue #6 não for fechada com proteção administrativa aplicada, toda escrita automatizada em `main` deve continuar com preflight de HEAD, fast-forward e `force=false`;
- `quality` e `vercel-source-bundle/validate` agora executam em PRs para `main`;
- o job de publish do transport branch só roda quando `github.ref == refs/heads/main`; em PR ele fica `SKIPPED` e usa somente `contents: read`;
- checkouts de jobs read-only usam `persist-credentials: false`; somente o job de publish mantém credencial Git necessária ao push do transport branch;
- testes de contrato proíbem `pull_request_target`, `workflow_run` e `repository_dispatch` nos workflows canônicos;
- o empacotador Vercel saiu do YAML inline para `scripts/ci/build-vercel-source-bundle.py`, versionado e determinístico;
- prova real com Dependabot PR #4 após rebase: `quality=PASS`, `vercel-source-bundle=PASS` e `publish=SKIPPED`;
- Dependabot abriu #3 (upload-artifact v4→v7 major), #4 (React/React DOM 19.2.7→19.2.8 patch) e #5 (@types/node 24→26 + ESLint 9→10 + TypeScript 5.9→7 majors);
- nenhum desses PRs será mesclado no candidato pré-FASE 4; #3/#5 são manutenção pós-deploy e #4, embora verde, fica congelado até o primeiro deployment territorial real;

- receipt consolidado de pré-deploy registrado em `docs/PREDEPLOY-RECEIPT-2026-09-07.md`; usar esse arquivo como checkpoint curto junto do `URGENTE.md` em novas conversas;

### Deployment candidate source-aligned — 2026-09-08

- deployment: `dpl_5C6SdRtv7GBzfa7TcUpGXtitvaZ5`;
- URL protegida: `https://teste-acheguese-7ks0frtai-jogo-brasils-projects.vercel.app`;
- source/runtime: `e735797b8f64947de13855cf8cf8c285e16435fa`;
- deployment: **READY**;
- build provou `required=yes supabase=configured`;
- Next.js 16.3.4: compile PASS;
- TypeScript: PASS;
- static generation: 12/12 PASS;
- quality `34217026909` + bundle `34217026860` = PASS;
- runtime errors observados: **0**;
- Home chegou ao aplicativo com HTTP 200 em uma sessão autenticada do preview;
- authority territorial compartilhada + fallback user-facing estão incluídos;
- smoke reforçado exige os dados oficiais do Complexo e rejeita fallback.

Previews anteriores permanecem somente como evidência histórica.

### Blocker de release atual

- Deployment Protection/SSO exige sessão/cookie persistente para smoke/visual completo;
- revisão visual 1440×900 / 390×844 continua pendente;
- callback Auth exata do candidate e E2E Auth/Classificados continuam pendentes;
- não desativar proteção, RLS ou CSP para contornar a limitação de inspeção.

### Próxima ação

**Inspecionar `dpl_5C6SdRtv7GBzfa7TcUpGXtitvaZ5` com sessão Vercel persistente → smoke completo → visual desktop/mobile → callback Auth exata → E2E Auth/Classificados → corrigir somente defeitos comprovados → fechar FASE 4.**

### Não repetir

- não reconstruir Censo, Educação ou CNES;
- não relaxar guards públicos de bbox/categorias;
- não expor service-role/secret key no Vercel;
- não contornar o preflight de env para fazer dev/build subir com configuração inválida;
- não adicionar wildcard de preview Vercel ao Auth; o candidato usa somente sua própria `VERCEL_URL`;
- não aprovar install script transitivo dev-only sem necessidade comprovada;
- não remover CSP/HSTS para “fazer o mapa funcionar”; ajustar somente as origens explícitas do provider quando necessário;
- não remover índices por `unused_index` sem tráfego real;
- não reintroduzir canonical global;
- não indexar Home/Mapa antes do rollout público;
- não reintroduzir `/empresas`, Unsplash, Home marketplace-first ou `features/discovery`;
- não reintroduzir CSS órfão da antiga landing;
- não remover `force-dynamic`/`private, no-store` das superfícies pessoais/admin;
- não carregar dataset inteiro no navegador;
- não quebrar deep links do mapa;
- não lançar território por publicação de dados;
- não iniciar Community/Empresas/Gastronomia/Mobilidade antes do gate visual/runtime;
- não inventar conteúdo para preencher estados vazios.

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
