import * as z from 'zod';

import { PurchaseRequestItemDecisionSchema } from '../../enums/PurchaseRequestItemDecision.schema';
// prettier-ignore
export const PurchaseRequestItemInputSchema = z.object({
    id: z.string(),
    purchaseRequestId: z.string(),
    productId: z.string(),
    titleSnapshot: z.string(),
    listPriceSnapshot: z.number(),
    quantity: z.number().int(),
    decision: PurchaseRequestItemDecisionSchema,
    agreedPrice: z.number().optional().nullable(),
    decisionReason: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    purchaseRequest: z.unknown(),
    product: z.unknown()
}).strict();

export type PurchaseRequestItemInputType = z.infer<typeof PurchaseRequestItemInputSchema>;
