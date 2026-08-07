import * as z from 'zod';

// prettier-ignore
export const PurchaseRequestItemInputSchema = z.object({
    id: z.string(),
    purchaseRequestId: z.string(),
    productId: z.string(),
    titleSnapshot: z.string(),
    listPriceSnapshot: z.number(),
    quantity: z.number().int(),
    createdAt: z.date(),
    purchaseRequest: z.unknown(),
    product: z.unknown()
}).strict();

export type PurchaseRequestItemInputType = z.infer<typeof PurchaseRequestItemInputSchema>;
