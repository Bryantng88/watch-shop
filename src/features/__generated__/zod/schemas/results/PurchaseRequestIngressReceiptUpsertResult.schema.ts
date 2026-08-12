import * as z from 'zod';
export const PurchaseRequestIngressReceiptUpsertResultSchema = z.object({
  id: z.string(),
  requestKey: z.string(),
  requestHash: z.string(),
  purchaseRequestId: z.string(),
  disposition: z.unknown(),
  addedItemCount: z.number().int(),
  createdAt: z.date(),
  purchaseRequest: z.unknown()
});