# Core

`src/core` contém capacidades de plataforma e domínio que podem ser consumidas por vários módulos.

## Regras

- Core não importa de `src/modules`.
- Core não importa de `src/app`.
- Core não conhece rotas ou UI específicas de módulos.
- Contratos devem ser independentes de Supabase quando possível.
- Adapters concretos pertencem à borda de dados/integração, não ao domínio.
- Uma capability só entra no Core quando é transversal ou tem segundo consumidor real.

Primeiros domínios previstos:

- territory;
- geospatial;
- map;
- identity/auth;
- media;
- moderation;
- search;
- notifications;
- observability.
