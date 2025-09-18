// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig(
    {
        ignores: ['**/dist', '*.d.ts', '**/coverage'],
    },
    {
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
            ...pluginVue.configs['flat/recommended'],
        ],
        files: ['**/*.{ts,vue}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
            parserOptions: {
                parser: tseslint.parser,
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                extraFileExtensions: ['vue'],
            },
        },
        rules: {
            // your rules
        },
    },
    {
        // FIXME: https://github.com/vuejs/vue-eslint-parser/issues/104
        files: ['demo/src/main.ts'],
        ...tseslint.configs.disableTypeChecked,
    },
    prettierConfig
);
