import { describe, expect, test } from 'vitest';
import { RequestBatcher } from '../../../src/lib/batcher/request-batcher';

describe('RequestBatcher', () => {
    const createBatcher = () =>
        new RequestBatcher<{ id: string; data: unknown }>({
            fetchOne: (id) => {
                const item = { id: String(id), data: {} };
                return new Promise((resolve) => resolve(item));
            },
            fetchBatch(ids) {
                const items = Object.fromEntries(
                    ids.map((id) => [String(id), { id: String(id), data: {} }])
                );

                return new Promise((resolve) => resolve(items));
            },
            maxBatchSize: 25,
        });

    test('', () => {
        expect(2 + 2).toBe(4);
    });
});
