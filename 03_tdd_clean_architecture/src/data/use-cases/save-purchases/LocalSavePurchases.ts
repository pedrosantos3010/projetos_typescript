import { CacheStore } from "@/data/protocols/cache";
import { PurchaseModel, SavePurchasesUseCase } from "@/domain/use-cases";

export class LocalSavePurchases implements SavePurchasesUseCase {
    public constructor(
        private _cacheStore: CacheStore<PurchaseModel>,
        private _timestamp: Date
    ) {}

    public async save(purchases: Array<PurchaseModel>): Promise<void> {
        this._cacheStore.replace("purchases", {
            timestamp: this._timestamp,
            value: purchases,
        });
    }
}
