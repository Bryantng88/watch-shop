import * as z from 'zod';
export const PurchaseRequestItemCreateResultSchema = z.object({
  id: z.string(),
  purchaseRequestId: z.string(),
  productId: z.string(),
  titleSnapshot: z.string(),
  listPriceSnapshot: z.number(),
  quantity: z.number().int(),
  createdAt: z.date(),
  purchaseRequest: z.unknown(),
  product: z.unknown()
});