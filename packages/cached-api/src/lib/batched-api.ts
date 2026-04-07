import { createLogger, LogLevel } from '@jobindex/common/lib/logger.js';
import type { TimerHandle } from '@jobindex/common/types.js';

type Id<_T> = string | number;

interface RequestBatcherOptions<T> {
    fetchOne: (id: Id<T>) => Promise<T>;
    fetchBatch: (ids: Id<T>[]) => Promise<Record<string, T>>;
    batchWindowMs: number;
    maxBatchSize: number;
    minLogLevel?: LogLevel;
}

export class RequestBatcher<T> {
    private logger: ReturnType<typeof createLogger>;
    private fetchOne: (id: Id<T>) => Promise<T>;
    private fetchBatch:
        | ((ids: string[]) => Promise<Record<string, T>>)
        | undefined;

    private batchWindowMs: number = 20;
    private maxBatchSize: number | undefined;

    private queuedIds: Set<string> = new Set();

    private resolvers: Map<
        string,
        { resolve: (v: T) => void; reject: (e: unknown) => void }[]
    > = new Map();

    private timer: TimerHandle | null = null;

    constructor(options: Partial<RequestBatcherOptions<T>> = {}) {
        const {
            fetchOne,
            fetchBatch,
            batchWindowMs,
            maxBatchSize,
            minLogLevel,
        } = options;

        this.logger = createLogger({
            name: 'cached-api::CachedAPI',
            minLevel: minLogLevel ?? LogLevel.Warn,
        });

        if (!fetchOne && !fetchBatch) {
            throw new Error(
                'RequestBatcher: provide at least `fetchOne` or `fetchBatch`'
            );
        }

        this.fetchOne =
            fetchOne ??
            (async () => {
                throw new Error(
                    'RequestBatcher: `fetchOne` is not configured (batch-only mode)'
                );
            });

        this.fetchBatch = fetchBatch;

        // batching state
        this.batchWindowMs = batchWindowMs ?? 20;
        this.maxBatchSize = maxBatchSize;

        this.logger.debug('new instance created', { options });
    }

    /**
     * Get a single object
     */
    async get(id: Id<T>): Promise<T> {
        this.logger.trace('get', { id });
        const key = String(id);

        // Create a new request
        return this.fetchBatch ? this.enqueueBatch(key) : this.fetchOne(id);
    }

    /**
     * Get multiple objects
     */
    async getMany(ids: Id<T>[]): Promise<T[]> {
        this.logger.trace('getMany', { ids });
        const uniqueIds = Array.from(new Set(ids));
        return Promise.all(uniqueIds.map((id) => this.get(id)));
    }

    /**
     * Queue an ID for the next batch flush (returns a per-ID promise).
     */
    private enqueueBatch(key: string): Promise<T> {
        this.logger.trace('enqueueBatch', { key });
        return new Promise(async (resolve, reject) => {
            // Add the batch promise to the resolvers map
            const list = this.resolvers.get(key) ?? [];
            list.push({ resolve, reject });
            this.resolvers.set(key, list);

            // Add the key to the queue
            this.queuedIds.add(key);

            // Set a timer until the queue is flushed
            if (this.timer === null) {
                this.timer = setTimeout(async () => {
                    this.logger.debug('flushing batch - timer');
                    await this.flushBatch();
                }, this.batchWindowMs);
            }

            // If the queue is already at max size, flush the queue immediately
            if (this.maxBatchSize && this.queuedIds.size >= this.maxBatchSize) {
                this.logger.debug('flushing batch - max size');
                await this.flushBatch();
            }
        });
    }

    /**
     * Flushes the batch queue, doing any pending fetches
     */
    private async flushBatch(): Promise<void> {
        this.logger.trace('flushBatch');
        if (!this.fetchBatch) {
            throw new Error(
                'RequestBatcher: `fetchBatch` is required for batch mode'
            );
        }

        // Get the enqueued IDs and clear the queue
        const ids = Array.from(this.queuedIds);
        this.queuedIds.clear();

        // Reset timer
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        // Return if there is nothing to fetch
        if (ids.length === 0) {
            return;
        }

        try {
            // Fetch batch using `fetchBatch`
            const resultMap = await this.fetchBatch(ids); // expects { [id]: T } keyed by stringified ids

            // Populate the cache
            ids.forEach((id) => {
                const value = resultMap[id];

                // Get promise for resolving
                const waiters = this.resolvers.get(id) ?? [];
                this.resolvers.delete(id);

                if (value !== undefined) {
                    waiters.forEach((w) => w.resolve(value));
                } else {
                    const err = new Error(`Missing result for id ${id}`);
                    waiters.forEach((w) => w.reject(err));
                }
            });
        } catch (err) {
            // Fan-out failure to all waiting ids
            ids.forEach((id) => {
                const waiters = this.resolvers.get(id) ?? [];
                this.resolvers.delete(id);
                waiters.forEach((w) => w.reject(err));
            });
        }
    }
}
