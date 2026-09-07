# Legacy Donor Map — Achegue-se original → plataforma v2

> **Autoridade de sequência:** `/URGENTE.md`  
> **Origem de referência:** `washingtonmsdj/acheguese`  
> **Destino canônico:** `washingtonmsdj/teste-acheguese`

## 1. Decisão

O repositório v2 permanece a base canônica do produto.

O repositório original não deve voltar a ser a linha principal de desenvolvimento. Ele passa a funcionar como **donor/reference** para conceitos, contratos, testes e implementações que possam ser auditados e adaptados à arquitetura territory-first.

Não criar um terceiro repositório para substituir os dois.

Quando a v2 tiver FASE 4 release-validada e estiver pronta para assumir a identidade final do produto, a estratégia de nomes/repos deve ser tratada como operação de release separada.

## 2. Motivo

Snapshot comparativo em 2026-09-07:

| Dimensão | Original | v2 |
| --- | ---: | ---: |
| Arquivos no repositório | ~5.956 | ~270 |
| Arquivos em `src/**` | ~4.099 | ~157 |
| Testes | ~431 | ~16 |
| Migrations SQL | ~553 | ~31 |
| Edge Functions | dezenas | 0 |
| Territory-first como eixo | parcial/reorganização | sim |
| DB/RLS | grande legado em reconciliação | banco v2 alinhado |
| Surface atual | muitos módulos | fundação + Classificados |
| Complexidade operacional | alta | baixa/controlada |

O tamanho do original representa patrimônio técnico, mas também superfície de regressão e reconciliação. A v2 oferece uma fundação menor onde cada capacidade pode ser incorporada conscientemente.

## 3. Regra de migração

Nunca copiar um domínio inteiro apenas porque ele existe no original.

Para cada item candidato:

1. identificar o comportamento que vale preservar;
2. localizar o owner/SSOT real no original;
3. revisar dependências e acoplamentos;
4. revisar migrations/RLS/RPCs relacionados;
5. separar regra de negócio de adapter/infra;
6. adaptar ao Core v2;
7. portar somente dados com provenance comprovada;
8. criar migration nova quando schema for necessário;
9. portar/reescrever testes de comportamento;
10. validar security advisor e gates da v2;
11. somente então ativar a Surface.

## 4. Já absorvido / não copiar novamente

A v2 já possui autoridade própria para:

- Territory / TerritoryGroup;
- boundaries do Complexo e quatro bairros;
- PostGIS territorial;
- provenance de Censo/Educação/CNES;
- Map Core v1;
- provider abstraction do mapa;
- bbox/zoom/clustering/deep links;
- rollout/readiness territorial;
- Home territory-first;
- Auth SSR;
- Classificados v2;
- moderação básica de Classificados;
- RLS e Storage de Classificados.

O original pode continuar como referência histórica nesses temas, mas não deve sobrescrever a implementação v2.

## 5. Donors de alta prioridade — somente depois da FASE 4

### Community

Referências relevantes no original:

- `src/core/community/**` (~66 entradas);
- `src/core/community-feed/**` (~80);
- community groups/issues/lost-found/recommendations;
- testes E2E territoriais relacionados.

Reaproveitar:

- taxonomia de tipos de conteúdo;
- invariantes de publicação/moderação;
- paginação/feed;
- anti-abuso;
- padrões de escopo territorial;
- testes de comportamento úteis.

Não copiar:

- geografia própria;
- feed que não use Territory v2;
- UI antiga;
- migrations em massa.

### Messaging / Notifications / Realtime

Referências:

- `src/core/messaging/**`;
- `src/core/notifications/**`;
- `src/core/realtime/**`.

Reaproveitar:

- contratos;
- participant authorization;
- unread/read models;
- padrões de realtime;
- testes negativos de autorização.

A autoridade deve continuar compartilhada e compatível com Classificados + Community, sem segundo sistema de mensagens.

### Moderation / Trust

Referências:

- `src/core/moderation/**`;
- `src/core/trust/**`.

Reaproveitar:

- taxonomia de denúncias;
- estados e comandos de moderação;
- auditoria/receipts;
- ban/trust patterns;
- testes de authority.

Integrar com a autoridade v2; não copiar roles/helpers concorrentes.

### Search / Media

Referências:

- `src/core/search/**`;
- `src/core/media/**`.

Reaproveitar contratos e testes quando Community/Business exigirem essas capacidades. Não introduzir mecanismo de busca dedicado antes de volume real.

## 6. Donors posteriores

### Empresas / Serviços

O original possui uma implementação muito extensa:

- `src/core/business/**` (~152 entradas);
- `src/modules/business/**` (~492).

Isso é patrimônio importante, mas **não deve ser portado antes de Territory + Community**.

Na fase correta, estudar seletivamente:

- Profile ↔ Business identity;
- memberships/ownership;
- horários/operação;
- contatos;
- reviews;
- media;
- lifecycle;
- autorização;
- analytics;
- testes autenticados.

Business v2 deve nascer sobre Territory/Place e não carregar localização paralela.

### Gastronomia

Usar o original como referência de especializações e fluxos, mas implementar como extensão de Business/Place quando possível.

Não portar um universo técnico independente.

### Mobilidade

O original possui:

- `src/core/mobility/**` (~134);
- `src/modules/mobility/**` (~209).

Somente avaliar depois que o escopo de Mobilidade for validado no produto. Não importar ride marketplace, dispatch, ETA ou routing próprio por antecipação.

### Billing

`src/core/billing/**` pode servir de referência futura quando monetização for realmente necessária. Não trazer Stripe/entitlements para a fundação antes de necessidade de negócio.

## 7. Donors de testes e tooling

O original possui aproximadamente:

- 73 entradas em `tests/e2e/**`;
- 166 entradas em `tools/**`.

Priorizar reaproveitamento de **ideias e invariantes** de teste:

- authz negativo;
- RLS;
- lifecycle;
- boundary/SSOT;
- E2E de domínio;
- provenance;
- release gates.

Não migrar harness inteiro se ele depender do stack Vite/legado.

## 8. O que não migrar

Não migrar automaticamente:

- shell/landing marketplace-first;
- estrutura antiga de navegação;
- namespaces/bridges históricos;
- migrations antigas em lote;
- tabelas/RPCs sem caller comprovado;
- fixtures e usuários fictícios;
- seeds sem provenance;
- `.env`/configuração de deploy do legado;
- segunda geografia;
- segundo mapa;
- segundo Auth;
- segundo sistema de moderação;
- Edge Functions que existam apenas para contornar arquitetura antiga;
- compatibilidade apenas para preservar caminhos obsoletos.

## 9. Política para o repositório original

Até decisão explícita de consolidação:

- não apagar o original;
- não tratá-lo como SSOT do produto v2;
- não desenvolver novas features lá para depois “copiar”;
- usar como donor somente quando uma fase da v2 pedir a capacidade;
- registrar em cada migração o source path/commit de origem quando código ou contrato for materialmente reaproveitado.

## 10. Estratégia futura de identidade do repositório

Depois da FASE 4 release-validada e antes de lançamento público, avaliar:

1. congelar/taguear o original como legado;
2. preservar histórico e referências;
3. mover a identidade pública/canônica para a v2;
4. opcionalmente renomear o original para `acheguese-legacy`;
5. opcionalmente renomear a v2 para `acheguese`;
6. revalidar Vercel, Supabase Auth redirects, docs e integrações após qualquer rename.

Essa operação não deve ocorrer enquanto a v2 ainda não passou o primeiro deployment territorial real.
