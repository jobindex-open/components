import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [vue(), tsconfigPaths()],
    test: {
        include: ['test/**/*.{test,spec}.ts'],
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
