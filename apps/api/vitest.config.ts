import { defineConfig } from 'vitest/config';
process.loadEnvFile();

export default defineConfig({
    test: {
        fileParallelism: false,
        coverage: {
            provider: "v8",
            exclude: [
                "node_modules/**",
                "coverage/**",
                "dist/**",
                "prisma/**",
                "**/generated/**",
                "src/configs"
            ],
        }
    },
})