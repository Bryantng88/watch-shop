import * as z from 'zod';

import { PurchaseRequestIngressDispositionSchema } from '../../enums/PurchaseRequestIngressDisposition.schema';
// prettier-ignore
export const PurchaseRequestIngressReceiptResultSchema = z.object({
    id: z.string(),
    requestKey: z.string(),
    requestHash: z.string(),
    purchaseRequestId: z.string(),
    disposition: PurchaseRequestIngressDispositionSchema,
    addedItemCount: z.number().int(),
    createdAt: z.date(),
    purchaseRequest: z.unknown()
}).strict();

export type PurchaseRequestIngressReceiptResultType = z.infer<typeof PurchaseRequestIngressReceiptResultSchema>;
