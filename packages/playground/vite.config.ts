import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), UnoCSS()],
    server: {
        allowedHosts: ['culpeo'],
    },
    resolve: {
        alias: {
            'pdfjs-vue-viewer':
                process.env.NODE_ENV === 'production'
                    ? 'pdfjs-vue-viewer'
                    : resolve(__dirname, '../pdfjs-vue/src/index.ts'),
        },
    },
    build: {
        minify: false,
    },
    optimizeDeps: {
        exclude: ['pdfjs-vue-viewer'],
    },
});
