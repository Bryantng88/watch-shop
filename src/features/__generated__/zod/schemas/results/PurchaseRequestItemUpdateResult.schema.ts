import * as z from 'zod';
export const PurchaseRequestItemUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  purchaseRequestId: z.string(),
  productId: z.string(),
  titleSnapshot: z.string(),
  listPriceSnapshot: z.number(),
  quantity: z.number().int(),
  decision: z.unknown(),
  agreedPrice: z.number().optional(),
  decisionReason: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  purchaseRequest: z.unknown(),
  product: z.unknown()
}));