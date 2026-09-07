# Classificados — arquitetura do primeiro MVP

## Objetivo

Fechar um vertical de ponta a ponta antes de iniciar Empresas.

Fluxo mínimo:

```
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

`Classified` nasce independente da camada de banco.

Estados permitidos:

- `draft`
- `pending_review`
- `published`
- `paused`
- `sold`
- `rejected`
- `archived`

Preço é salvo em **centavos**, nunca em ponto flutuante.

Localização pública deve priorizar cidade/região. Coordenada exata não deve ser exibida por padrão em anúncios pessoais.

Imagens ficam em object storage. O banco guarda somente chaves e metadados.

## Fronteiras

- `domain`: regras e tipos puros.
- `data`: contratos de repositório.
- `app`: composição de páginas e ações.
- autenticação, geografia, mídia e moderação são capacidades compartilhadas, não regras internas de Classificados.

## Banco futuro

Quando a camada persistente entrar, o desenho esperado é PostgreSQL com:

- `classifieds`
- `classified_media`
- `classified_favorites`
- `classified_reports`
- `classified_categories`
- `cities`

Índices iniciais:

- `(status, city_id, published_at desc)`
- `(category_id, status, published_at desc)`
- `(owner_id, updated_at desc)`
- busca textual indexada
- índice geográfico apenas quando o produto realmente usar raio/proximidade

Paginação pública deve ser cursor-based.

## Segurança

- toda escrita validada no servidor;
- usuário só altera seus próprios anúncios;
- moderação possui papel separado;
- storage não aceita caminho arbitrário fornecido pelo cliente;
- uploads validam tipo, tamanho e quantidade;
- contato não expõe dados pessoais além do que o anunciante autorizar;
- RLS será aplicada quando o Supabase entrar.

## Escala

Não criar microserviço agora. O domínio fica isolado dentro do monólito modular e poderá ser extraído depois sem mudar os contratos de produto.
