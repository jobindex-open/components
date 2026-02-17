// @ts-check

import baseConfig from './base.config.mjs';
import pluginVue from 'eslint-plugin-vue';
import prettierConfig from 'eslint-config-prettier';

import {
    defineConfigWithVueTs,
    vueTsConfigs,
} from '@vue/eslint-config-typescript';

export default defineConfigWithVueTs(
    ...baseConfig,
    pluginVue.configs['flat/essential'],
    vueTsConfigs.recommendedTypeChecked,
    prettierConfig
);
