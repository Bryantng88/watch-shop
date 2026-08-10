import * as z from 'zod';

import { PurchaseRequestItemDecisionSchema } from '../../enums/PurchaseRequestItemDecision.schema';
// prettier-ignore
export const PurchaseRequestItemModelSchema = z.object({
    id: z.string(),
    purchaseRequestId: z.string(),
    productId: z.string(),
    titleSnapshot: z.string(),
    listPriceSnapshot: z.number(),
    quantity: z.number().int(),
    decision: PurchaseRequestItemDecisionSchema,
    agreedPrice: z.number().nullable(),
    decisionReason: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    purchaseRequest: z.unknown(),
    product: z.unknown()
}).strict();

export type PurchaseRequestItemPureType = z.infer<typeof PurchaseRequestItemModelSchema>;
