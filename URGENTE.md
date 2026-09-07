# URGENTE — Plano Canônico de Execução do Achegue-se

> **Status:** ATIVO  
> **Autoridade:** este documento é a rota canônica de execução do projeto.  
> **Branch de trabalho:** `main`  
> **Última atualização:** 2026-09-07  
> **HEAD técnico de referência:** `c5ea13f36c4c7df76138e99aad69b7925c8955c9`

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

- [~] redesign desktop profissional e organizado — source concluído; revisão visual real pendente;
- [~] preservar boa experiência mobile — composição responsiva concluída em source; revisão visual real pendente;
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

A fundação territorial, o Map Core e o MVP da Home estão fechados em source/CI com hardening de segurança, cache e rollout SEO. A próxima fase de produto continua bloqueada.

## Próximo passo

> **Após o reset da cota Vercel, publicar exatamente o bundle do HEAD territorial mais recente com as três variáveis públicas e executar a revisão visual/runtime real de Home + Mapa antes de abrir Community.**

### Inputs já preparados

- `NEXT_PUBLIC_SITE_URL`: alias canônico do projeto Vercel;
- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto `acheguese-v2` confirmada;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: existe uma publishable key ativa confirmada no Supabase;
- nenhum secret/service-role deve entrar no bundle;
- o conector Vercel disponível não persiste env vars no projeto, portanto os valores públicos devem ser enviados no payload do deployment conforme o mecanismo já documentado.

### Sequência imediata após o reset

1. conferir que `main` e `deploy/vercel-bundle` apontam para o mesmo `SOURCE_SHA`;
2. criar um único deployment candidato com as três variáveis públicas;
3. aguardar estado `READY`;
4. validar `/api/health`, `/robots.txt` e `/sitemap.xml`;
5. validar Home no Complexo e nos quatro `?bairro=<slug>`;
6. validar `/mapa`, filtros, clustering, deep links e fallback;
7. conferir que Home/Mapa permanecem `noindex` enquanto rollout = `data_preparation`;
8. executar revisão visual real desktop + mobile;
9. inspecionar runtime logs/erros do deployment;
10. corrigir qualquer regressão encontrada e repetir quality gate;
11. somente então fechar FASE 4 e avaliar FASE 5 — Community.

### Regra de avanço

**Não iniciar Community, Empresas, Gastronomia ou Mobilidade antes desse gate de deployment.** Não alterar arquitetura para contornar a cota Vercel.

---

# 21. Checkpoint atual

### HEAD técnico de referência

`c5ea13f36c4c7df76138e99aad69b7925c8955c9`

### Fase

**FASE 0 concluída · FASE 1 concluída · FASE 2 baseline MVP concluída · FASE 3 source/CI + security hardening concluídos · FASE 4 MVP source/CI + performance/SEO/runtime/observability hardening concluídos · validação visual/runtime em deployment pendente.**

### Concluído recentemente

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
- migrations remotas/Git alinhadas até `20260907102801_map_rpc_category_guards_v1`;
- smoke válido preservado: **4 boundaries + 20 locais**, inclusive com role `anon`;
- health endpoint passou a exigir canário do Territory Core + Salvador/Classificados;
- observabilidade server-side estruturada foi adicionada sem stack/contexto arbitrário e com redaction de keys/JWT;
- bundle Vercel agora possui manifesto de source closure e teste contra omissão de lifecycle scripts;
- payload atual contém o `scripts/copy-maplibre-worker.mjs` e **0 arquivos .env**;
- allowlist obsoleta `images.unsplash.com` foi removida;
- `package.json` declara ESM explicitamente; os warnings `MODULE_TYPELESS_PACKAGE_JSON` foram eliminados sem alterar arquivos CommonJS, pois o repositório não possui `.js/.cjs`;
- CSS global da antiga landing/marketplace foi auditado contra todo `src/**`: **35 seletores órfãos removidos, 0 classes globais órfãs restantes**;
- HEAD técnico `c5ea13f3`: lint, TypeScript, testes e build **PASS**;
- `vercel-source-bundle` do HEAD técnico `c5ea13f3`: **PASS**;
- branch `deploy/vercel-bundle` sincronizada com `SOURCE_SHA=c5ea13f36c4c7df76138e99aad69b7925c8955c9`;
- Supabase security advisors: **0 lints**;
- nenhum rollout territorial foi alterado.

### Blocker de release

- o único deployment Vercel continua sendo o técnico antigo `dpl_4hgED9grfQNbT6DLCrZEUaCqqnWv`;
- ele ainda usa source `68deb8a4...`, sem Map Core/Home territorial e sem as três envs públicas do `acheguese-v2`;
- a cota Hobby segue com reset informado para **2026-09-08 03:23:07 America/Bahia**;
- até esse reset, não criar tentativas extras nem workaround arquitetural.

### Próxima ação

**Após o reset: confirmar novamente HEAD/SOURCE_SHA/security advisors → criar um único deployment candidato com as 3 envs públicas → health/SEO/Home/Mapa → revisão visual desktop+mobile → runtime logs → corrigir eventuais blockers → fechar FASE 4.**

### Não repetir

- não reconstruir Censo, Educação ou CNES;
- não relaxar guards públicos de bbox/categorias;
- não expor service-role/secret key no Vercel;
- não remover índices por `unused_index` sem tráfego real;
- não reintroduzir canonical global;
- não indexar Home/Mapa antes do rollout público;
- não reintroduzir `/empresas`, Unsplash, Home marketplace-first ou `features/discovery`;
- não reintroduzir CSS órfão da antiga landing;
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
