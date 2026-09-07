# Administração de Classificados

A moderação usa um claim assinado no JWT:

`app_metadata.role = "classified_admin"`

## Regras

- Nunca usar `user_metadata` para autoridade.
- Usuários comuns não conseguem atribuir ou alterar `app_metadata`.
- Após atribuir/remover o papel administrativo, a sessão deve ser renovada para receber o novo claim.
- A rota administrativa é `/admin/classificados`.
- A aplicação não usa `service_role` no navegador.

## Autoridade do moderador

O banco permite somente:

1. `pending_review -> published`
2. `pending_review -> rejected` com motivo
3. `published -> paused` com motivo

O trigger bloqueia alterações administrativas em título, descrição, preço, categoria, localização, dono, slug e moeda.

Cada decisão escreve auditoria em `private.classified_moderation`.

## Denúncias

Usuários autenticados podem denunciar um anúncio publicado uma única vez. O dono do próprio anúncio não pode denunciá-lo. Moderadores podem ler as denúncias via RLS.
