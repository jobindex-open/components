import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), tsconfigPaths()],
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
