import { GenericCache } from './generic-cache';
import { serializeRequest } from '../util/serialization';
import { Md5 } from 'ts-md5';

export class RequestCache extends GenericCache<Response> {
    public override get(idOrRequest: string | Request) {
        const _key = this.toKey(idOrRequest);

        return super.get(_key);
    }

    public override set(
        idOrRequest: string | Request,
        value: Response,
        ttl?: number
    ) {
        const _key = this.toKey(idOrRequest);

        return super.set(_key, value, ttl);
    }

    public override has(idOrRequest: string | Request) {
        const _key = this.toKey(idOrRequest);

        return super.has(_key);
    }

    public override touch(idOrRequest: string | Request, ttl?: number) {
        const _key = this.toKey(idOrRequest);

        return super.touch(_key, ttl);
    }

    public getCacheKey(request: Request) {
        return this.createKey(request);
    }

    private toKey(idOrRequest: string | Request) {
        return typeof idOrRequest === 'string'
            ? idOrRequest
            : this.createKey(idOrRequest);
    }

    private createKey(request: Request) {
        const searialized = serializeRequest(request);
        return Md5.hashStr(searialized);
    }
}
