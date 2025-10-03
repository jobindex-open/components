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
            external: [
                'vue',
                // 'pdfjs-dist'
            ],
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue',
                    'pdfjs-dist': 'pdfjs',
                },
            },
        },
    },

    test: {
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/cypress/**',
            '**/.{idea,git,cache,output,temp,direnv,devenv}/**',
            '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
        ],
        // browser: {
        //     enabled: true,
        //     provider: 'playwright',
        //     // https://vitest.dev/guide/browser/playwright
        //     instances: [
        //         { browser: 'chromium' },
        //         { browser: 'firefox' },
        //         { browser: 'webkit' },
        //     ],
        // },
    },
});
