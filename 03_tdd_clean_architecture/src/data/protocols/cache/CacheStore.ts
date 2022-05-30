export interface CacheStore<T> {
    delete(key: string): void;
    insert(key: string, items: T[]): void;
}
