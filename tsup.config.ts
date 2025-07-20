import {defineConfig} from 'tsup';

export default defineConfig({
    entry: ['src/server.ts'],
    outDir: 'dist',
    dts: true,
    format: ['cjs'],
    target: 'es2020',
    clean: true
});