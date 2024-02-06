import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            core: resolve(__dirname, '../core'),
        },
    },

    test: {
        environment: 'jsdom',
        include: ['__tests__/**/*.spec.ts', '__tests__/**/*.spec.tsx'],
        watch: false,
        coverage: {
            enabled: true,
            provider: 'v8',
        },
        setupFiles: ['./__tests__/vitest.setup.ts'],
    },
});
