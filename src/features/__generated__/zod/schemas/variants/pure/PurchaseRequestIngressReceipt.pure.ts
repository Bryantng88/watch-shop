import * as z from 'zod';

import { PurchaseRequestIngressDispositionSchema } from '../../enums/PurchaseRequestIngressDisposition.schema';
// prettier-ignore
export const PurchaseRequestIngressReceiptModelSchema = z.object({
    id: z.string(),
    requestKey: z.string(),
    requestHash: z.string(),
    purchaseRequestId: z.string(),
    disposition: PurchaseRequestIngressDispositionSchema,
    addedItemCount: z.number().int(),
    createdAt: z.date(),
    purchaseRequest: z.unknown()
}).strict();

export type PurchaseRequestIngressReceiptPureType = z.infer<typeof PurchaseRequestIngressReceiptModelSchema>;
