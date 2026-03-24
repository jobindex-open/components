import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { RequestCache } from '../../../src/lib/cache/request-cache';

describe('RequestCache', () => {
    const fetch = vi.fn();

    beforeEach(() => {
        vi.stubGlobal('fetch', fetch);
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    const createFetchResponse = (data: unknown) => {
        return { json: () => new Promise((resolve) => resolve(data)) };
    };

    test('Normal cache behavior', async () => {
        const fetchResponse = createFetchResponse([
            {
                status: 'ok',
            },
        ]);

        fetch.mockResolvedValue(fetchResponse);
        const requestCache = new RequestCache();

        const expectedResult1 = {
            response: fetchResponse,
            fromCache: false,
        };

        const result1 = await requestCache.cachedRequest('localhost:8000');

        expect(
            fetch,
            'Request not in cache; fetch is called'
        ).toHaveBeenCalledOnce();

        expect(result1, 'Response, not from cache').toStrictEqual(
            expectedResult1
        );

        const expectedResult2 = {
            response: fetchResponse,
            fromCache: true,
        };

        const result2 = await requestCache.cachedRequest('localhost:8000');

        expect(
            fetch,
            'Request in cache; fetch has still only been called once'
        ).toHaveBeenCalledOnce();

        expect(result2, 'Response, from cache').toStrictEqual(expectedResult2);

        const expectedResult3 = {
            response: fetchResponse,
            fromCache: false,
        };

        const result3 = await requestCache.cachedRequest(
            'localhost:8000/other'
        );

        expect(
            fetch,
            'Request not in cache; fetch called'
        ).toHaveBeenCalledTimes(2);

        expect(result3, 'Request is different, not in cache').toStrictEqual(
            expectedResult3
        );
    });

    test('Force refresh', async () => {
        const fetchResponse = createFetchResponse([
            {
                status: 'ok',
            },
        ]);

        fetch.mockResolvedValue(fetchResponse);
        const requestCache = new RequestCache();

        const expectedResult1 = {
            response: fetchResponse,
            fromCache: false,
        };

        const result1 = await requestCache.cachedRequest('localhost:8000');

        expect(
            fetch,
            'Request not in cache; fetch is called'
        ).toHaveBeenCalledOnce();

        expect(result1, 'Response, not from cache').toStrictEqual(
            expectedResult1
        );

        const expectedResult2 = {
            response: fetchResponse,
            fromCache: false,
        };

        const result2 = await requestCache.cachedRequest('localhost:8000', {
            forceRefresh: true,
        });

        expect(
            fetch,
            'Force network, cache is skipped; fetch is called'
        ).toHaveBeenCalledTimes(2);

        expect(
            result2,
            'Response with force refresh, not from cache'
        ).toStrictEqual(expectedResult2);
    });

    test('Set TTL', async () => {
        const fetchResponse = createFetchResponse([
            {
                status: 'ok',
            },
        ]);

        fetch.mockResolvedValue(fetchResponse);
        const requestCache = new RequestCache();

        const expectedResult1 = {
            response: fetchResponse,
            fromCache: false,
        };

        const result1 = await requestCache.cachedRequest('localhost:8000', {
            ttl: 1000,
        });

        expect(
            fetch,
            'Request not in cache; fetch is called'
        ).toHaveBeenCalledOnce();

        expect(result1, 'Response, not from cache').toStrictEqual(
            expectedResult1
        );

        const expectedResult2 = {
            response: fetchResponse,
            fromCache: true,
        };

        vi.advanceTimersByTime(500);

        const result2 = await requestCache.cachedRequest('localhost:8000');

        expect(fetch, 'Cache hit; fetch not called').toHaveBeenCalledOnce();

        expect(result2, 'Response after 500ms, request in cache').toStrictEqual(
            expectedResult2
        );

        const expectedResult3 = {
            response: fetchResponse,
            fromCache: false,
        };

        vi.advanceTimersByTime(1500);
        const result3 = await requestCache.cachedRequest('localhost:8000');

        expect(fetch, 'Cache expired, fetch is called').toHaveBeenCalledTimes(
            2
        );

        expect(result3, 'Response after 1500ms, cache is stale').toStrictEqual(
            expectedResult3
        );
    });
});
