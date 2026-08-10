import * as z from 'zod';
export const PurchaseRequestItemFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});