import neetwork from '@neetwork/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig(
    ...neetwork,
    {
        rules: {
            'no-restricted-properties': ['error', { object: 'process', property: 'env', message: 'Use src/schemas/env.schema.ts instead.' }],
        },
    },
    {
        files: ['src/schemas/env.schema.ts', 'src/configs/prisma.ts', 'prisma.config.ts'],
        rules: {
            'no-restricted-properties': 'off',
        },
    },
);
