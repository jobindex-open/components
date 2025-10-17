import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        exclude: [...configDefaults.exclude, '**/tsdown.config.*'],
        coverage: {
            exclude: [...configDefaults.coverage.exclude, '**/tsdown.config.*'],
        },
    },
});
