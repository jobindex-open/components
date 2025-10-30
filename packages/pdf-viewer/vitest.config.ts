import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [vue(), tsconfigPaths()],
    test: {
        // projects: [
        //     {
        //         test: {
        include: [
            'test/unit/**/*.{test,spec}.ts',
            'test/**/*.unit.{test,spec}.ts',
        ],
        name: 'unit',
        environment: 'node',
        //     },
        // },
        // {
        //     test: {
        //         include: [
        //             'test/browser/**/*.{test,spec}.ts',
        //             'test/**/*.browser.{test,spec}.ts',
        //         ],
        //         name: 'browser',
        //         setupFiles: ['vitest-browser-vue'],
        //         browser: {
        //             enabled: true,
        //             provider: playwright(),
        //             instances: [{ browser: 'chromium' }],
        //         },
        //     },
        // },
        // ],
        coverage: {
            exclude: [
                '**/index.ts',
                '**/types.ts',
                ...coverageConfigDefaults.exclude,
            ],
        },
    },
});
