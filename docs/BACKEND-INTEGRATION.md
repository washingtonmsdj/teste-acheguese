# Backend integration checkpoint

## Estado atual

O backend do novo Achegue-se está criado no Supabase isolado `acheguese-v2` e o código já contém a integração SSR.

### Implementado
- clientes Supabase tipados;
- proxy de sessão;
- login/cadastro por e-mail e senha;
- callback de confirmação;
- logout;
- validação server-side dos dados do anúncio;
- criação de rascunho;
- edição;
- Storage privado;
- upload/removal de imagens via cliente com RLS;
- painel "Meus anúncios";
- envio e retirada da revisão;
- migrations e tipos sincronizados com o banco.

### Segurança
- RLS em tabelas expostas;
- schemas privados sem acesso direto;
- nenhuma secret key no frontend;
- funções de workflow usam `SECURITY INVOKER`;
- transições são guardadas por trigger no banco;
- `anon` não executa RPCs de workflow;
- security advisors sem findings.

### Pendente para teste end-to-end
A integração ainda precisa das variáveis públicas no ambiente de deploy:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

O projeto Vercel antigo `acheguese` não deve ser reutilizado para esta reconstrução.
