import { GenericCache } from './generic-cache';
import { serializeRequest } from '../util/serialization';
import { Md5 } from 'ts-md5';

export class RequestCache extends GenericCache<Response> {
    /**
     * Do a cached request
     */
    public async cachedRequest(
        url: string,
        options?: Partial<{
            ttl: number;
            forceRefresh: boolean;
            headers: Record<string, string>;
            controller: AbortController;
        }>
    ) {
        const reqInit: RequestInit = {};

        if (options?.headers) {
            reqInit.headers = options.headers;
        }

        if (options?.controller) {
            reqInit.signal = options.controller.signal;
        }

        const request = new Request(url, reqInit);

        const key = this.createKey(request);

        if (!options?.forceRefresh) {
            const cached = this.get(key);
            if (cached) return { response: cached, fromCache: true };
        }

        const response = await fetch(request);

        const ttl = options?.ttl ?? this.ttl;

        this.set(key, response, ttl);

        return { response, fromCache: false };
    }

    private createKey(request: Request) {
        const searialized = serializeRequest(request);
        return Md5.hashStr(searialized);
    }
}
