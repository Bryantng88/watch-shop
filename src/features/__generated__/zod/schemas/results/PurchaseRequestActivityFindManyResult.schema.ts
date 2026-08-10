import * as z from 'zod';
export const PurchaseRequestActivityFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  purchaseRequestId: z.string(),
  type: z.unknown(),
  note: z.string().optional(),
  actorUserId: z.string().optional(),
  followUpAt: z.date().optional(),
  createdAt: z.date(),
  purchaseRequest: z.unknown(),
  actor: z.unknown().optional()
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