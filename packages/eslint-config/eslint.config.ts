import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    globalIgnores(['**/dist', '**/generated', '**/coverage']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            eslint.configs.recommended,
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
            '@typescript-eslint/no-unnecessary-condition': 'error',
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
            eqeqeq: ['error', 'smart'],
            'no-console': ['error', { allow: ['warn', 'error'] }],
        },
    },
    {
        files: ['**/*.config.ts', '**/*.spec.ts', '**/*.test.ts', '**/prisma/**/*.ts'],
        extends: [tseslint.configs.disableTypeChecked],
    },
);
