import { defineConfig } from 'vitest/config';
import {
    type PlaywrightProviderOptions,
    playwright,
} from '@vitest/browser-playwright';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';

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
        include: [
            'test/browser/**/*.{test,spec}.ts',
            'test/**/*.browser.{test,spec}.ts',
        ],
        name: 'browser',
        setupFiles: ['vitest-browser-vue'],
        browser: {
            enabled: true,
            provider: playwright(playwrightConfig),
            instances: [{ browser: 'chromium' }],
        },
    },
});
