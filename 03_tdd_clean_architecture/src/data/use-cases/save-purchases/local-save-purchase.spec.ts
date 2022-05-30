import {
    CacheStoreSpy,
    CacheStoreSpyMessage,
    mockPurchases,
} from "@/data/tests";
import { LocalSavePurchases } from "@/data/use-cases";
import { channel } from "diagnostics_channel";

type SutTypes = {
    sut: LocalSavePurchases;
    cacheStore: CacheStoreSpy;
};

const localSavePurchasesFactory = (): SutTypes => {
    const cacheStore = new CacheStoreSpy();
    const sut = new LocalSavePurchases(cacheStore);

    return { cacheStore, sut };
};

describe("LocalSavePurchases", () => {
    it("Should not delete or insert cache on sut.init", () => {
        const { cacheStore, sut } = localSavePurchasesFactory();
        expect(cacheStore.messages).toEqual([]);
    });
    it("Should delete old cache on sut.save", async () => {
        const { cacheStore, sut } = localSavePurchasesFactory();
        await sut.save(mockPurchases());
        expect(cacheStore.messages).toEqual([
            CacheStoreSpyMessage.delete,
            CacheStoreSpyMessage.insert,
        ]);
        expect(cacheStore.deleteKey).toBe("purchases");
    });

    it("Should not insert new cache if delete fails", async () => {
        const { cacheStore, sut } = localSavePurchasesFactory();
        cacheStore.simulateDeleteError();
        expect(sut.save(mockPurchases())).rejects.toThrow();
        expect(cacheStore.messages).toEqual([CacheStoreSpyMessage.delete]);
    });

    it("Should insert new cache if delete succeeds", async () => {
        const { cacheStore, sut } = localSavePurchasesFactory();
        const purchases = mockPurchases();
        await sut.save(purchases);
        expect(cacheStore.messages).toEqual([
            CacheStoreSpyMessage.delete,
            CacheStoreSpyMessage.insert,
        ]);
        expect(cacheStore.insertKey).toBe("purchases");
        expect(cacheStore.items).toEqual(purchases);
    });

    it("Should throw if insert throws", async () => {
        const { cacheStore, sut } = localSavePurchasesFactory();
        cacheStore.simulateInsertError();
        expect(sut.save(mockPurchases())).rejects.toThrow();
        expect(cacheStore.messages).toEqual([
            CacheStoreSpyMessage.delete,
            CacheStoreSpyMessage.insert,
        ]);
    });
});
