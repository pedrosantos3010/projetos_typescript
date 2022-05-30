import { CacheItem, CacheStore } from "@/data/protocols/cache";

export enum CacheStoreSpyActions {
    delete,
    insert,
}

export class CacheStoreSpy<T> implements CacheStore<T> {
    public actions: Array<CacheStoreSpyActions> = [];
    public deleteKey = "";
    public insertKey = "";
    public insertValues?: CacheItem<T>;

    public delete(key: string): void {
        this.actions.push(CacheStoreSpyActions.delete);
        this.deleteKey = key;
        this.insertValues = undefined;
    }

    public insert(key: string, value: CacheItem<T>): void {
        this.actions.push(CacheStoreSpyActions.insert);
        this.insertKey = key;
        this.insertValues = value;
    }

    public replace(key: string, value: CacheItem<T>): void {
        this.delete(key);
        this.insert(key, value);
    }

    public simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(
            () => {
                this.actions.push(CacheStoreSpyActions.delete);
                throw new Error();
            }
        );
    }

    public simulateInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(
            () => {
                this.actions.push(CacheStoreSpyActions.insert);
                throw new Error();
            }
        );
    }
}
