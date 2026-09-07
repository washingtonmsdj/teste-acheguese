import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,

  {
    files: ['src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/modules/*', '@/app/*', '@/data/*'],
              message:
                'Core não pode depender de modules, app ou data. Inverta a dependência.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['src/data/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app/*', '@/modules/*'],
              message:
                'Data Platform não pode depender de app ou módulos de produto.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['src/modules/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app/*'],
              message:
                'Módulos não podem depender de rotas/app. App compõe módulos, não o contrário.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/app/*',
                '@/core/*',
                '@/data/*',
                '@/modules/*',
              ],
              message:
                'Shared deve permanecer neutro e não depender de camadas de domínio.',
            },
          ],
        },
      ],
    },
  },

  globalIgnores(['.next/**', 'node_modules/**']),
]);
