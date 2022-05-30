export interface CacheItem<T> {
    timestamp: Date;
    value: T[];
}

export interface CacheStore<T> {
    delete(key: string): void;
    insert(key: string, items: CacheItem<T>): void;
    replace(key: string, items: CacheItem<T>): void;
}
