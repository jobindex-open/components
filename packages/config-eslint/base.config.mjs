// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import vitest from '@vitest/eslint-plugin';

export default defineConfig(
    eslint.configs.recommended,
    prettierConfig,
    {
        files: ['test/**'], // or any other pattern
        plugins: {
            vitest,
        },
        rules: {
            ...vitest.configs.recommended.rules,
        },
        settings: {
            vitest: {
                typecheck: true,
            },
        },
        languageOptions: {
            globals: {
                ...vitest.environments.env.globals,
            },
        },
    },
    {
        plugins: {
            turbo: turboPlugin,
        },
        rules: {
            'turbo/no-undeclared-env-vars': 'warn',
        },
    },
    {
        ignores: ['**/dist', '*.d.ts', '**/coverage', 'eslint.config.mjs'],
    }
);
