# Achegue-se

Plataforma territorial e comunitária para conectar moradores ao que acontece, às pessoas, aos lugares, serviços, oportunidades e informações ao redor deles.

## MVP

Lançamento inicial no Complexo do Nordeste de Amaralina, Salvador/BA:

- Nordeste de Amaralina;
- Santa Cruz;
- Vale das Pedrinhas;
- Chapada do Rio Vermelho.

## Direção oficial

```text
Platform Foundation
→ Territory
→ Territory Data
→ Map
→ Home territorial
→ Community
→ Alerts / Events / Opportunities
→ integração de Classificados
→ Empresas / Serviços
→ Gastronomia
→ Mobilidade quando justificada
```

Classificados foi o primeiro vertical técnico construído, mas não é o eixo arquitetural do produto.

## Antes de contribuir

Leia obrigatoriamente:

1. `URGENTE.md`;
2. `docs/ARCHITECTURE.md`;
3. ADRs relevantes em `docs/adr/`.

## Princípios

- Territory-first.
- Modular monolith.
- Mobile-first sem sacrificar desktop profissional.
- Dados públicos com provenance.
- Zero dados fictícios apresentados como reais.
- PostGIS/mapa preparados para escala.
- RLS e fail-closed.
- Sem microservices prematuros.
- Sem mini-sistemas por módulo.

## Ambiente local

Use Node 24 e mantenha configuração local fora do Git:

```bash
cp .env.example .env.local
```

Preencha em `.env.local` a `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ativa do projeto `acheguese-v2`. A URL canônica já está indicada no exemplo.

Antes de iniciar:

```bash
npm run env:check
npm run dev
```

`npm run dev` exige a configuração pública completa e falha antes do Next quando `.env.local` não contém a publishable key ativa. Isso evita iniciar a Home em estado `territory_home_config_unavailable`.

Se uma sessão dev já estiver aberta após alterar `.env.local`, reinicie o processo do Next para recarregar as variáveis.

CI sem env pública continua suportado; Vercel/release também permanecem fail-closed para configuração obrigatória.

Nunca versionar service-role, `sb_secret_...`, senha ou token administrativo.
