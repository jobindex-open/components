import { beforeEach, describe, expect, test, vi } from 'vitest';
import { RequestCache } from '../../../src/lib/cache/request-cache';

describe('RequestCache', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('get()', async () => {
        const cache = new RequestCache();

        const request = new Request('http://example.com');

        const response = new Response('Hello, world!', { status: 200 });

        expect(
            cache.get(request),
            'No response in cache for the request'
        ).toBeNull();

        cache.set(request, response);

        expect(cache.get(request), 'Response cached').toStrictEqual(response);
    });

    test('has()', async () => {
        const cache = new RequestCache();

        const request = new Request('http://example.com');

        const response = new Response('Hello, world!', { status: 200 });

        expect(
            cache.has(request),
            'No response in cache for the request'
        ).toBeFalsy();

        cache.set(request, response);

        expect(cache.has(request), 'Response cached').toBeTruthy();
    });

    test('touch()', async () => {
        const cache = new RequestCache();

        const request = new Request('http://example.com');

        const response = new Response('Hello, world!', { status: 200 });

        cache.set(request, response);
        cache.touch(request);

        expect(cache.has(request)).toBeTruthy();
    });

    test('getCacheKey()', () => {
        const cache = new RequestCache();
        const request1 = new Request('http://example.com');
        const request2 = new Request('http://example.com/path/to/page');

        const response = new Response('Hello, world!', { status: 200 });

        expect(cache.getCacheKey(request1)).toBe(
            'fcd5eeff3edafcc32a574684e245aa85'
        );

        expect(cache.getCacheKey(request2)).toBe(
            'd4f5e91857fcb08ed05be2a55bccd533'
        );

        cache.set(request1, response);

        expect(cache.has(request1), 'Lookup by request').toBeTruthy();
        expect(
            cache.has('fcd5eeff3edafcc32a574684e245aa85'),
            'Lookup by key'
        ).toBeTruthy();
    });
});
