import { CacheStore } from "@/data/protocols/cache";
import { PurchaseModel } from "@/domain/use-cases";

export enum CacheStoreSpyMessage {
    delete,
    insert,
}

export class CacheStoreSpy implements CacheStore<PurchaseModel> {
    public messages: Array<CacheStoreSpyMessage> = [];
    public deleteKey = "";
    public insertKey = "";
    public items: Array<PurchaseModel> = [];

    public delete(key: string): void {
        this.messages.push(CacheStoreSpyMessage.delete);
        this.deleteKey = key;
        this.items = [];
    }

    public insert(key: string, items: PurchaseModel[]): void {
        this.messages.push(CacheStoreSpyMessage.insert);
        this.insertKey = key;
        this.items.push(...items);
    }

    public simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(
            () => {
                this.messages.push(CacheStoreSpyMessage.delete);
                throw new Error();
            }
        );
    }

    public simulateInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(
            () => {
                this.messages.push(CacheStoreSpyMessage.insert);
                throw new Error();
            }
        );
    }
}
