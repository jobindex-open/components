import type { TimerHandle } from '@jobindex/common/types.ts';
import { CacheStats } from './cache-stats';
import type { IEvictionStrategy } from './eviction-strategies/strategy.interface';

interface CacheEntry<T> {
    value: T | null;
    expiresAt: number;
}

export interface GenericCacheOptions<K = string> {
    // TTL settings
    ttl: number;
    removeStale: boolean;
    autoClean: boolean;
    cleanupInterval: number;

    // Size limit settings
    limitSize: boolean;
    maxSize: number;
    evictionStrategy: IEvictionStrategy<K>;
}

export class GenericCache<T, K = string> {
    private cache: Map<K, CacheEntry<T>>;

    protected ttl: number;
    private removeStale: boolean;
    private autoClean: boolean;
    private cleanupInterval: number;
    private cleanupTimer: TimerHandle;

    private limitSize: boolean;
    private maxSize: number;
    private evictionStrategy: IEvictionStrategy<K> | undefined;

    private stats: CacheStats;

    constructor(options?: Partial<GenericCacheOptions<K>>) {
        this.ttl = options?.ttl ?? 10 * 60_000; // 10 min TTL
        this.removeStale = options?.removeStale || true;
        this.autoClean = options?.autoClean || false;
        this.cleanupInterval = options?.cleanupInterval || 60 * 60_000; // Clean up every hour

        this.limitSize = options?.limitSize || false;
        this.maxSize = options?.maxSize || 1000;
        this.evictionStrategy = options?.evictionStrategy || undefined;

        this.cache = new Map();

        this.cleanupTimer = undefined;

        this.stats = new CacheStats();

        if (this.autoClean) this.startCleanup();
    }

    /**
     * Add a cache entry
     */
    public set(key: K, value: T, ttl?: number) {
        const _ttl = ttl ?? this.ttl;

        // Update existing entry
        if (this.cache.has(key)) {
            const entry = this.cache.get(key);
            entry!.value = value;
            entry!.expiresAt = this.now() + _ttl;
            this.evictionStrategy?.update(key);
            return;
        }

        // Cache size limit
        if (this.limitSize && this.cache.size >= this.maxSize) {
            // If size limit is being hit, try evict an entry
            this.tryEviction();
        }

        this.cache.set(key, {
            value,
            expiresAt: this.now() + _ttl,
        });
        this.evictionStrategy?.enroll(key);

        this.stats.increment('sets');
    }

    /**
     * Get a cache entry
     */
    public get(key: K) {
        const entry = this.cache.get(key);
        if (!entry) {
            this.stats.increment('misses');
            return null;
        }

        if (this.isStale(entry)) {
            if (this.removeStale) this.remove(key);
            this.stats.increment('misses');
            this.stats.increment('expirations');
            return null;
        }

        this.stats.increment('hits');
        return entry.value;
    }

    /**
     * Check if cache contains key
     */
    public has(key: K) {
        const entry = this.cache.get(key);

        if (!entry || this.isStale(entry)) {
            return false;
        }

        return true;
    }

    /**
     * Update an entrys timestamp
     */
    public touch(key: K, ttl?: number) {
        const _ttl = ttl ?? this.ttl;

        const item = this.cache.get(key);
        if (!item) return false;

        item.expiresAt = this.now() + _ttl;
        this.evictionStrategy?.update(key);
        return true;
    }

    /**
     * Clear the cache
     */
    public clear() {
        this.evictionStrategy?.clear();
        this.cache.clear();
    }

    /**
     * Remove a cache entry
     */
    public remove(key: K) {
        this.evictionStrategy?.remove(key);
        this.cache.delete(key);
    }

    /**
     * Get the current cache size
     */
    public size() {
        return this.cache.size;
    }

    /**
     * Set a new default ttl.
     */
    public setTTL(ttlMs: number | undefined) {
        this.ttl = ttlMs || 0;
    }

    /**
     * Cleanup all stale entries
     */
    public cleanup() {
        let cleaned = 0;

        this.cache.forEach((val, key) => {
            if (this.isStale(val)) {
                this.remove(key);
                cleaned++;
            }
        });

        this.stats.increment('cleaned', cleaned);

        return cleaned;
    }

    /**
     * Start automatic cleanup
     */
    public startCleanup() {
        if (this.cleanupTimer) return;

        this.cleanupTimer = setInterval(() => {
            this.cleanup();
        }, this.cleanupInterval);

        this.cleanupTimer = undefined;
    }

    /**
     * Stop automatic cleanup
     */
    public stopCleanup() {
        if (!this.cleanupTimer) return;

        clearInterval(this.cleanupTimer);
        this.cleanupTimer = undefined;
    }

    /**
     * Dispose of the cache
     */
    public destroy() {
        this.stopCleanup();
        this.cache.clear();
    }

    public getStats() {
        const hits = this.stats.get('hits') || 0;
        const misses = this.stats.get('misses') || 0;

        const total = hits + misses;

        const hitRate = total > 0 ? (hits / total) * 100 : 0;
        return {
            ...this.stats,
            size: this.cache.size,
            maxSize: this.maxSize,
            hitRate: `${hitRate.toFixed(2)}%`,
        };
    }

    public resetStats() {
        this.stats.clear();
    }

    /**
     * Tries to use the set eviction strategy to evict an element
     */
    private tryEviction() {
        const evicted = this.evictionStrategy?.evict();
        if (!evicted) return false;

        this.cache.delete(evicted);
        this.stats.increment('evictions');
        return true;
    }

    /**
     * Check if a cache entry is stale
     */
    private isStale(entry: CacheEntry<T>) {
        const ttl = this.ttl;
        if (ttl <= 0) {
            return false;
        }
        return this.now() > entry.expiresAt;
    }

    private now() {
        return Date.now();
    }
}
