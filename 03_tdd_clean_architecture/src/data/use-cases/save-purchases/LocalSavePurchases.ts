import { CacheStore } from "@/data/protocols/cache";
import { PurchaseModel, SavePurchasesUseCase } from "@/domain/use-cases";

export class LocalSavePurchases implements SavePurchasesUseCase {
    public constructor(private _cacheStore: CacheStore<PurchaseModel>) {}

    public async save(purchases: Array<PurchaseModel>): Promise<void> {
        this._cacheStore.delete("purchases");
        this._cacheStore.insert("purchases", purchases);
    }
}
