import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { GenericCache } from '../../../src/lib/cache/generic-cache';

describe('GenericCache', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    test('set() / get()', () => {
        const cache = new GenericCache();

        const item1 = { message: 'hello' };

        cache.set('item1', item1);

        expect(cache.get('item1'), 'Get item1').toStrictEqual(item1);
        expect(cache.get('item2'), 'Get item2: invalid item').toBeUndefined();
    });

    test('has()', () => {
        const cache = new GenericCache();

        const item1 = { message: 'hello' };

        cache.set('item1', item1);

        expect(cache.has('item1'), 'Has item1').toBeTruthy();
        expect(cache.has('item2'), 'Has item2: invalid item').toBeFalsy();
    });

    test('clear()', () => {
        const cache = new GenericCache();

        const item1 = { message: 'hello' };
        const item2 = { message: 'hello, world!' };

        cache.set('item1', item1);
        cache.set('item2', item2);

        expect(cache.has('item1'), 'Has item1').toBeTruthy();
        expect(cache.has('item2'), 'Has item2').toBeTruthy();

        cache.clear();

        expect(cache.has('item1'), 'Has item1 - cleared').toBeFalsy();
        expect(cache.has('item2'), 'Has item2 - cleared').toBeFalsy();
    });

    test('size()', () => {
        const cache = new GenericCache();

        const item1 = { message: 'hello' };
        const item2 = { message: 'hello, world!' };

        expect(cache.size(), 'No items').toBe(0);

        cache.set('item1', item1);

        expect(cache.size(), '1 item').toBe(1);

        cache.set('item2', item2);

        expect(cache.size(), '2 items').toBe(2);

        cache.remove('item1');

        expect(cache.size(), '1 item - remove item1').toBe(1);
    });

    test('ttl', () => {
        const cache = new GenericCache();

        const item1 = { message: 'hello' };
        const item2 = { message: 'hello, world' };

        cache.set('item1', item1, 1000);
        cache.set('item2', item2, 2000);

        vi.advanceTimersByTime(500);

        expect(
            cache.has('item1'),
            'time advanced by 500 ms - not stale'
        ).toBeTruthy();

        expect(
            cache.has('item2'),
            'time advanced by 500 ms - not stale'
        ).toBeTruthy();

        vi.advanceTimersByTime(1500);

        expect(
            cache.has('item1'),
            'time advanced by 1500 ms - stale'
        ).toBeFalsy();

        expect(
            cache.has('item2'),
            'time advanced by 1500 ms - not stale'
        ).toBeTruthy();
    });

    test('Auto clean', () => {
        const cache = new GenericCache({
            autoClean: true,
            cleanupInterval: 1 * 60_000,
        });

        const item1 = { message: 'hello' };
        const item2 = { message: 'hello, world' };
        const item3 = { message: 'hi' };

        cache.set('item1', item1, 60_100);
        cache.set('item2', item2, 2 * 60_000 + 100);
        cache.set('item3', item3, 5_000);

        expect(cache.size(), 'time not advanced - 3 items').toBe(3);
        expect(cache.has('item1')).toBeTruthy();
        expect(cache.has('item2')).toBeTruthy();
        expect(cache.has('item3')).toBeTruthy();

        vi.advanceTimersByTime(10_000);

        expect(
            cache.size(),
            'time advanced by 10 seconds, before gc size is 3'
        ).toBe(3);
        expect(cache.has('item1')).toBeTruthy();
        expect(cache.has('item2')).toBeTruthy();
        expect(cache.has('item3'), 'Item3 stale, before gc').toBeFalsy();

        vi.advanceTimersByTime(50_200);

        expect(
            cache.size(),
            'time advanced by 60 seconds, after first gc'
        ).toBe(2);

        expect(cache.has('item1'), 'item1 expired after gc').toBeFalsy();
        expect(cache.has('item2')).toBeTruthy();
        expect(cache.has('item3')).toBeFalsy();

        vi.advanceTimersByTime(5 * 60_000);

        expect(cache.size(), 'All items stale and garbage collected').toBe(0);

        expect(cache.has('item1')).toBeFalsy();
        expect(cache.has('item2')).toBeFalsy();
        expect(cache.has('item3')).toBeFalsy();
    });
});
