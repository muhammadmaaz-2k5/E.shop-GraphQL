export interface Cache {
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
    delete(key: string): Promise<void>;
    deletePattern(pattern: string): Promise<void>;
    getOrSet<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T>;
}
export declare function getCache(): Cache;
//# sourceMappingURL=index.d.ts.map