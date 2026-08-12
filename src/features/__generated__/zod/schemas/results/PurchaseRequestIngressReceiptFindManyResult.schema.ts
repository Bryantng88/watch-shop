import * as z from 'zod';
export const PurchaseRequestIngressReceiptFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  requestKey: z.string(),
  requestHash: z.string(),
  purchaseRequestId: z.string(),
  disposition: z.unknown(),
  addedItemCount: z.number().int(),
  createdAt: z.date(),
  purchaseRequest: z.unknown()
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