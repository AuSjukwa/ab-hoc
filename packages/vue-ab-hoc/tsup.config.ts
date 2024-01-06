import { defineConfig } from 'tsup';

export default defineConfig([
    {
        entry: ['src/*.ts', 'src/*.tsx'],
        format: 'cjs',
        dts: true,
        clean: true,
    },
    {
        entry: ['src/*.ts', 'src/*.tsx'],
        format: 'esm',
    },
]);
