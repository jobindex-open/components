import { describe, expect, test, vi } from 'vitest';
import { init } from '../../src/lib';

vi.mock('pdfjs-dist', () => ({}));

describe('index.ts', () => {
    test('should export expected members', () => {
        expect(init).toBeDefined();
    });
});
