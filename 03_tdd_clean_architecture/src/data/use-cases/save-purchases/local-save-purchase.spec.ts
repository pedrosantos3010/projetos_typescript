import {
    CacheStoreSpy,
    CacheStoreSpyActions,
    mockPurchases,
} from "@/data/tests";
import { LocalSavePurchases } from "@/data/use-cases";
import { PurchaseModel } from "@/domain/use-cases";

type SutTypes = {
    sut: LocalSavePurchases;
    cacheStore: CacheStoreSpy<PurchaseModel>;
};

const localSavePurchasesFactory = (timestamp = new Date()): SutTypes => {
    const cacheStore = new CacheStoreSpy<PurchaseModel>();
    const sut = new LocalSavePurchases(cacheStore, timestamp);

    return { cacheStore, sut };
};

describe("LocalSavePurchases", () => {
    it("Should not delete or insert cache on sut.init", () => {
        const { cacheStore } = localSavePurchasesFactory();
        expect(cacheStore.actions).toEqual([]);
    });

    it("Should not insert new cache if delete fails", async () => {
        const { cacheStore, sut } = localSavePurchasesFactory();
        cacheStore.simulateDeleteError();
        await expect(sut.save(mockPurchases())).rejects.toThrow();
        expect(cacheStore.actions).toEqual([CacheStoreSpyActions.delete]);
    });

    it("Should insert new cache if delete succeeds", async () => {
        const timestamp = new Date();
        const { cacheStore, sut } = localSavePurchasesFactory();
        const purchases = mockPurchases();

        await expect(sut.save(purchases)).resolves.toBeFalsy();

        expect(cacheStore.actions).toEqual([
            CacheStoreSpyActions.delete,
            CacheStoreSpyActions.insert,
        ]);
        expect(cacheStore.deleteKey).toBe("purchases");
        expect(cacheStore.insertKey).toBe("purchases");
        expect(cacheStore.insertValues).toEqual({
            timestamp,
            value: purchases,
        });
    });

    it("Should throw if insert throws", async () => {
        const { cacheStore, sut } = localSavePurchasesFactory();
        cacheStore.simulateInsertError();
        await expect(sut.save(mockPurchases())).rejects.toThrow();
        expect(cacheStore.actions).toEqual([
            CacheStoreSpyActions.delete,
            CacheStoreSpyActions.insert,
        ]);
    });
});
