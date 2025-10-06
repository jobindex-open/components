import { defineConfig } from 'tsdown';
import Vue from 'unplugin-vue/rolldown';

export default defineConfig([
    {
        entry: ['./src/index.ts'],
        platform: 'neutral',
        external: ['vue'],
        plugins: [Vue({ isProduction: true })],
        dts: {
            vue: true,
        },
    },
]);
