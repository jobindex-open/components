export class CacheStats {
    private statMap: Map<string, number>;

    constructor() {
        this.statMap = new Map();
    }

    public forEach(callbackFn: (value: number, key: string) => void) {
        this.statMap.forEach(callbackFn);
    }

    public get(key: string) {
        return this.statMap.get(key);
    }

    public getAll() {
        return Object.fromEntries(this.statMap);
    }

    public set(key: string, amount: number) {
        this.statMap.set(key, amount);
    }

    public increment(key: string, amount: number = 1) {
        const stat = this.statMap.get(key);
        if (!stat) return undefined;

        const newVal = stat + amount;
        this.statMap.set(key, newVal);

        return newVal;
    }

    public remove(key: string) {
        this.statMap.delete(key);
    }

    public clear() {
        this.statMap.clear();
    }
}
