// @ts-check

import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import baseConfig from './base.config.mjs';

export default defineConfig(
    ...baseConfig,
    tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
    prettierConfig
);
