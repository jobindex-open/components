import type { IEvictionStrategy } from './strategy.interface';

interface LRUNode<K> {
    key: K;
    next?: LRUNode<K> | undefined;
    prev?: LRUNode<K> | undefined;
}

/**
 * Least Recently Used Eviction Strategy
 *
 * Based on this:
 * https://oneuptime.com/blog/post/2026-01-30-nodejs-memory-cache-ttl/view#implementing-lru-least-recently-used-eviction
 */
export class LRUEvictionStrategy<K = string> implements IEvictionStrategy<K> {
    private map: Map<K, LRUNode<K>>;
    private head: LRUNode<K> | undefined;
    private tail: LRUNode<K> | undefined;

    constructor() {
        this.map = new Map();
        this.head = undefined;
        this.tail = undefined;
    }

    public enroll(key: K) {
        const node: LRUNode<K> = {
            key,
        };
        this.addToHead(node);
        this.map.set(key, node);
    }

    public update(key: K) {
        const node = this.map.get(key);
        if (!node) return;

        this.moveToHead(node);
    }

    public remove(key: K) {
        const node = this.map.get(key);
        if (!node) return;

        this.removeNode(node);
        this.map.delete(key);
    }

    public clear() {
        this.map.clear();
    }

    public evict() {
        if (!this.tail) return undefined;

        const evicted = this.tail;
        this.removeNode(evicted);

        this.map.delete(evicted.key);
        return evicted.key;
    }

    private moveToHead(node: LRUNode<K>) {
        if (node === this.head) return;

        this.removeNode(node);
        this.addToHead(node);
    }

    private addToHead(node: LRUNode<K>) {
        node.prev = undefined;
        node.next = this.head;

        if (this.head) {
            this.head.prev = node;
        }

        this.head = node;

        if (!this.tail) {
            this.tail = node;
        }
    }

    private removeNode(node: LRUNode<K>) {
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }

        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }
    }
}
