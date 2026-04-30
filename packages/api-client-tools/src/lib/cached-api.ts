import { createLogger, LogLevel } from '@jobindex/common/lib/logger.ts';
import type { HTTPMethod } from '@jobindex/common/types.js';
import { LRUEvictionStrategy } from './cache/eviction-strategies/lru.strategy';
import { RequestCache } from './cache/request-cache';

export interface CachedAPIConfig {
    url?: URL | string | undefined;
    cacheKey: string;
    ttl: number;
    headers?: Record<string, string>;
    minLogLevel?: LogLevel;
}

export abstract class CachedAPI {
    private config: CachedAPIConfig;
    private cache: RequestCache;
    private logger: ReturnType<typeof createLogger>;

    constructor(config: CachedAPIConfig) {
        this.logger = createLogger({
            name: 'cached-api::CachedAPI',
            minLevel: config.minLogLevel ?? LogLevel.Warn,
        });
        this.config = config;

        this.cache = new RequestCache({
            autoClean: true,
            limitSize: true,
            evictionStrategy: new LRUEvictionStrategy(),
        });

        this.logger.debug('new instance created', { config: this.config });
    }

    protected request(
        url: string,
        method: HTTPMethod = 'GET',
        data?: object,
        headers?: Record<string, string>,
        options?: { forceNetwork: boolean }
    ) {
        this.logger.trace('request', { url, method, data, headers });

        const controller = new AbortController();

        const hasBody = !(method === 'GET' || method === 'HEAD');

        const fullUrl = hasBody ? this.buildUrl(url) : this.buildUrl(url, data);

        const request = new Request(fullUrl, {
            method,
            headers: this.buildHeaders(headers),
            signal: controller.signal,
            body: hasBody ? JSON.stringify(data) : null,
        });

        const responsePromise = new Promise((resolve, reject) => {
            const cachedResponse = this.cache.get(request);

            if (cachedResponse && !options?.forceNetwork) {
                this.logger.debug('Cache hit', request);
                resolve(cachedResponse);
                return;
            }

            this.logger.debug('Cache miss', request);
            fetch(request)
                .then((response) => {
                    this.cache.set(request, response);
                    resolve(response);
                })
                .catch((e: Error) => reject(e));
        });

        return {
            result: this.promiseToResult(responsePromise),
            controller,
        };
    }

    private buildUrl(url: string, params?: object): URL {
        this.logger.trace('buildUrl', { url, params });
        const path = url.startsWith('/') ? url : `/${url}/`;
        const fullUrl = `${this.config.url}${path}`;

        const urlObject = new URL(fullUrl, window.location.origin);

        if (!params) {
            return urlObject;
        }

        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && typeof value === 'string') {
                urlObject.searchParams.append(key, value);
            }
        });

        return urlObject;
    }

    private buildHeaders(headers?: Record<string, string>): HeadersInit {
        this.logger.trace('buildHeaders', { headers });
        return {
            ...this.config.headers,
            ...headers,
        };
    }

    private async promiseToResult<T>(promise: Promise<T>) {
        this.logger.trace('promiseToResult');
        try {
            return { data: await promise };
        } catch (error) {
            return { error: error as Error };
        }
    }
}
