import { defineConfig } from 'tsdown';
import Vue from 'unplugin-vue/rolldown';

export default defineConfig({
    entry: ['src/index.ts'],
    external: ['vue'],
    target: 'es2020',
    tsconfig: './tsconfig.app.json',
    platform: 'neutral',
    plugins: [Vue({ isProduction: true })],
    dts: { build: true, vue: true },
});
