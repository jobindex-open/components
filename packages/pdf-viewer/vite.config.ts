/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],

    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'pdf-viewer',
            fileName: 'index',
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'vue',
                },
            },
        },
    },
});
