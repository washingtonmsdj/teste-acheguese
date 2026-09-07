# Modules

Módulos são verticais de produto que consomem o Core.

## Regra de dependência

Permitido:

```text
modules → core
modules → shared
modules → adapters/libs aprovados durante migração
```

Proibido:

```text
core → modules
modules → app
module A → internals de module B
```

## Estado

- `classifieds`: primeiro vertical existente; congelado para novas features e será migrado progressivamente para Territory Core.
- `community`: futuro, somente após Territory/Data/Map/Home.
- `businesses`, `gastronomy`, `mobility`: não iniciar antes dos gates definidos em `URGENTE.md`.
