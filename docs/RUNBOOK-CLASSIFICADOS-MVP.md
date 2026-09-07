# Runbook — Classificados MVP

Este documento define o caminho operacional para transformar o vertical de Classificados do estado atual em candidato de lançamento.

## 1. Fontes canônicas

- Código: branch `main`
- Banco: Supabase `acheguese-v2` (`hnuhabsuzaagsjrtyzdo`)
- Deploy: Vercel `teste-acheguese` (`prj_MUONHjTGLsctNJZ7J1BWB8xzMidj`)
- Transporte Vercel: branch técnica `deploy/vercel-bundle`

O projeto legado `acheguese` não participa deste fluxo.

## 2. Gates obrigatórios antes de deploy

O HEAD candidato deve ter:

1. quality workflow PASS;
2. source-bundle workflow PASS;
3. Supabase security advisors com 0 lints;
4. migrations do Git alinhadas ao histórico aplicado;
5. nenhum secret/service-role no source ou bundle.

Quality gate atual:

`npm ci → lint → typecheck → tests → build`

## 3. Variáveis públicas do deployment

O deployment conectado ao backend precisa de:

- `NEXT_PUBLIC_SITE_URL=https://teste-acheguese.vercel.app`
- `NEXT_PUBLIC_SUPABASE_URL=https://hnuhabsuzaagsjrtyzdo.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key do acheguese-v2>`

Esses valores são configuração pública. Nunca inserir:

- service-role;
- secret key;
- senha;
- token administrativo;
- JWT privado.

## 4. Deploy pela branch de transporte

A integração disponível cria deployments por upload de arquivos, não por Git import.

O workflow `vercel-source-bundle.yml` gera:

- `SOURCE_SHA`
- `vercel-files.json`

Procedimento:

1. confirmar que `SOURCE_SHA` é igual ao HEAD da `main`;
2. carregar `vercel-files.json`;
3. acrescentar `.env.production` apenas em memória no payload do deployment;
4. fazer deploy para o projeto `teste-acheguese`;
5. nunca commitar `.env.production` na `main`.

## 5. Pós-deploy técnico

Antes de qualquer E2E:

### 5.1 Health
`GET /api/health`

Esperado:

- HTTP 200;
- `status = ok`;
- `database = ok`.

Se retornar 503 `not_configured`, o deployment não recebeu as variáveis públicas.

### 5.2 Indexação

Validar:

- `/robots.txt`;
- `/sitemap.xml`;
- canonical da Home;
- canonical do detalhe de anúncio publicado;
- JSON-LD Product/Offer no detalhe.

Sem `NEXT_PUBLIC_SITE_URL`, o site deve permanecer noindex/fail-closed.

### 5.3 Headers

Confirmar pelo menos:

- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `X-Frame-Options: DENY`;
- ausência de `X-Powered-By`.

## 6. Supabase Auth

Não criar usuários diretamente em `auth.users`.

Criar a primeira conta real pelo fluxo normal de cadastro da aplicação.

Depois:

1. configurar a Site URL do Supabase para o domínio candidato;
2. permitir o callback `/auth/callback`;
3. confirmar o e-mail;
4. renovar a sessão;
5. somente então atribuir o papel administrativo assinado:
   `app_metadata.role = classified_admin`;
6. renovar novamente a sessão para o novo claim entrar no JWT.

Nunca usar `user_metadata` para autoridade.

## 7. Campanha E2E mínima

Usar pelo menos três identidades reais de teste controladas:

- anunciante;
- comprador;
- administrador.

### Cenário A — anúncio
1. anunciante cria conta;
2. cria rascunho;
3. adiciona foto;
4. edita;
5. envia para revisão;
6. confirma que não aparece publicamente.

### Cenário B — moderação
1. admin abre `/admin/classificados`;
2. aprova;
3. anúncio aparece na listagem;
4. detalhe abre;
5. sitemap pode incluí-lo.

### Cenário C — comprador
1. comprador favorita;
2. inicia conversa;
3. envia mensagem;
4. denuncia o anúncio;
5. terceiro não participante não acessa a conversa.

### Cenário D — ajustes
1. admin retira publicado para ajustes com motivo;
2. anúncio some da área pública;
3. dono vê o motivo;
4. corrige;
5. envia novamente;
6. admin republica.

### Cenário E — encerramento
1. dono marca vendido;
2. anúncio sai da listagem;
3. arquiva;
4. exclusão definitiva só deve funcionar sem conversas, denúncias ou histórico de moderação.

## 8. Smoke tests de banco

Arquivo rollback-safe:

`supabase/smoke/anon-rls.sql`

Ele valida sem criar usuários:

- Salvador público;
- anônimo não vê não-publicados;
- anônimo não cria anúncios;
- anônimo não executa RPCs de revisão.

Fluxos owner/admin não devem ser simulados inserindo diretamente em `auth.users`; validar via E2E Auth real.

## 9. Critérios de bloqueio

Não lançar se qualquer um ocorrer:

- security advisor diferente de zero;
- health != 200;
- anúncio não aprovado visível ao público;
- conversa legível por terceiro;
- admin baseado em `user_metadata`;
- service-role no cliente;
- callback Auth aberto para origem inesperada;
- sitemap indexando área privada;
- E2E crítico falhando.

## 10. Rollback operacional

Se o deployment novo apresentar regressão:

1. manter banco/migrations intactos;
2. reativar o último deployment Vercel saudável;
3. não reverter migration destrutivamente sem análise;
4. registrar HEAD, deployment ID, migration version e sintoma;
5. corrigir na `main` e gerar novo bundle.

## 11. Definition of Done do E2E de Classificados

Este runbook valida o vertical já existente. Ele **não autoriza iniciar Empresas nem altera a ordem de execução do produto**. A autoridade de sequência permanece em `/URGENTE.md`.

Classificados é considerado tecnicamente validado quando:

- deployment backend-connected está saudável;
- Auth real passou;
- campanha E2E crítica passou;
- moderação real passou;
- acessibilidade automatizada não tem blocker crítico;
- observabilidade mínima está ativa;
- este runbook foi executado uma vez com sucesso.

Depois disso, seguir a fase indicada pelo `URGENTE.md`; atualmente Empresas continua bloqueado até as fundações e fases anteriores exigidas estarem concluídas.
