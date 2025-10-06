import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), UnoCSS()],
    resolve: {
        alias: {
            '@jobindex/pdf-viewer':
                process.env.NODE_ENV === 'production'
                    ? '@jobindex/pdf-viewer'
                    : resolve(
                          __dirname,
                          '../../packages/pdf-viewer/src/index.ts'
                      ),
        },
    },
    build: {
        minify: false,
    },
    optimizeDeps: {
        exclude: ['@jobindex/pdf-viewer'],
    },
});
