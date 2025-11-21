import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import type { PlaywrightProviderOptions } from '@vitest/browser-playwright';

const playwrightEndpoint = process.env.PW_TEST_CONNECT_WS_ENDPOINT;
const playwrightConfig: PlaywrightProviderOptions = playwrightEndpoint
    ? {
          connectOptions: {
              wsEndpoint: playwrightEndpoint,
              exposeNetwork: '<loopback>',
          },
      }
    : {};

export default defineConfig({
    plugins: [vue(), tsconfigPaths()],
    test: {
        projects: [
            // Unit tests
            {
                extends: true,
                test: {
                    include: [
                        'test/unit/**/*.{test,spec}.ts',
                        'test/**/*.unit.{test,spec}.ts',
                    ],
                    name: 'unit',
                    environment: 'jsdom',
                },
            },

            // Browser tests (jsdom)
            {
                extends: true,
                test: {
                    include: [
                        'test/browser/**/*.{test,spec}.ts',
                        'test/**/*.browser.{test,spec}.ts',
                    ],
                    name: 'browser',
                    environment: 'jsdom',
                },
            },

            // e2e tests (playwright)
            {
                extends: true,
                test: {
                    name: 'e2e',
                    include: [
                        'test/e2e/**/*.{test,spec}.ts',
                        'test/**/*.e2e.{test,spec}.ts',
                    ],
                    setupFiles: ['vitest-browser-vue'],
                    browser: {
                        enabled: true,
                        provider: playwright(playwrightConfig),
                        instances: [{ browser: 'chromium' }],
                    },
                },
            },
        ],
        coverage: {
            include: ['src/**/*.{ts,vue}'],
            exclude: [
                '**/*.d.ts',
                '**/index.ts',
                '**/types.ts',
                ...coverageConfigDefaults.exclude,
            ],
        },
    },
});
