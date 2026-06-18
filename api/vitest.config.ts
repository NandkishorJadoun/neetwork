import { defineConfig } from 'vitest/config'

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
            ],
        }
    },
})