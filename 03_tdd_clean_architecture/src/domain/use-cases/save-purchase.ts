export interface SavePurchasesUseCase {
    save(purchases: Array<PurchaseModel>): Promise<void>;
}

export type PurchaseModel = {
    id: string;
    date: Date;
    value: number;
};
