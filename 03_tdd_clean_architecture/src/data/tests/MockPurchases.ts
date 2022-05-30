import { PurchaseModel } from "@/domain/use-cases";
import faker from "@faker-js/faker";

export const mockPurchases = (): PurchaseModel[] => [
    {
        id: faker.datatype.uuid(),
        date: faker.date.recent(),
        value: faker.datatype.number(),
    },
    {
        id: faker.datatype.uuid(),
        date: faker.date.recent(),
        value: faker.datatype.number(),
    },
];
