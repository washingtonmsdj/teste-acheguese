# Classificados — vertical técnico existente

> **Autoridade de sequência:** `/URGENTE.md`  
> Este documento descreve o vertical já implementado. Ele **não autoriza iniciar Empresas** nem altera a ordem territory-first.

## Papel no produto

Classificados foi o primeiro vertical técnico construído, mas não é o eixo arquitetural do Achegue-se.

Ele deve consumir as capacidades compartilhadas da plataforma — Auth, localização, mídia, moderação e, progressivamente, Territory — sem criar uma segunda arquitetura.

Novas features permanecem congeladas, salvo correção crítica, segurança ou trabalho necessário para integração ao Core autorizado pelo `URGENTE.md`.

## Fluxo atual

```text
descobrir
→ filtrar
→ abrir anúncio
→ entrar/criar conta
→ publicar/editar
→ anexar fotos
→ favoritar
→ contatar
→ denunciar/moderar
→ acompanhar em Meus anúncios
```

## Entidade principal

`Classified` mantém regras de domínio independentes da camada de banco.

Estados canônicos:

- `draft`
- `pending_review`
- `published`
- `paused`
- `sold`
- `rejected`
- `archived`

Preço é persistido em **centavos**, nunca em ponto flutuante.

Localização pública prioriza cidade/região; coordenada pessoal exata não deve ser exposta por padrão.

## Persistência real

O projeto `acheguese-v2` já possui PostgreSQL/Supabase com RLS. As entidades principais são:

- `classifieds`
- `classified_media`
- `classified_favorites`
- `classified_reports`
- `classified_categories`
- `classified_conversations`
- `classified_messages`
- `cities`

O banco v2 está sem conteúdo transacional fictício no checkpoint pré-release; Salvador/BA e as categorias são seeds estruturais.

## Mídia

O bucket canônico é `classified-media`:

- privado;
- limite de 8 MB;
- JPEG, PNG, WebP e AVIF;
- upload/delete restritos ao owner autenticado;
- leitura pública somente quando o anúncio está efetivamente publicado, ou pelo próprio owner conforme policy.

O banco guarda chaves/metadados; a aplicação trabalha com URLs assinadas quando necessário.

## Segurança e lifecycle

- escrita passa por servidor + RLS;
- owner só opera sobre o próprio anúncio;
- owner não consegue se autopublicar;
- moderação usa autoridade `classified_admin` em `app_metadata`;
- `user_metadata` nunca concede papel administrativo;
- admin não usa a autoridade de moderação para moderar o próprio anúncio;
- anúncio publicado fica protegido contra mutações incompatíveis;
- submit/withdraw seguem RPCs canônicas;
- `anon` não possui escrita nem EXECUTE nas RPCs de workflow;
- denúncias têm `UNIQUE (classified_id, reporter_id)`;
- conversas têm `UNIQUE (classified_id, buyer_id)` e impedem buyer = seller;
- favoritos só podem apontar para anúncio efetivamente público: `status='published'` e `published_at <= now()`.

O smoke `supabase/smoke/anon-rls.sql` é rollback-safe e faz parte da prova pré-release.

## Fronteiras

- `domain`: regras e tipos puros;
- `data`: contratos/repositórios;
- `app`: composição de páginas e server actions;
- Auth, Territory, mídia, moderação e observabilidade são capacidades compartilhadas.

Não criar microserviço ou mini-plataforma paralela para este vertical.

## Integração territorial

A cidade `Salvador/BA` continua sendo seed estrutural do vertical existente. A evolução deve aproximar Classificados do Territory Core sem duplicar geografia nem autoridade.

Qualquer migração territorial de Classificados deve preservar:

- RLS;
- URLs/canonicals já válidos;
- lifecycle/moderação;
- privacidade de localização pessoal;
- compatibilidade com dados reais existentes quando houver.

## Gate de release

O E2E específico está em `docs/RUNBOOK-CLASSIFICADOS-MVP.md`.

Mesmo com Classificados tecnicamente validado, a próxima fase do produto é determinada exclusivamente por `URGENTE.md`.
