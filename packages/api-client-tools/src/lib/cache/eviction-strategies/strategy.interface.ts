export interface IEvictionStrategy<K> {
    enroll(key: K): void;
    update(key: K): void;
    remove(key: K): void;
    clear(): void;
    evict(): K | undefined;
}
