import * as z from 'zod';
export const StrapInventoryMovementFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  strapVariantId: z.string(),
  movementType: z.unknown(),
  quantity: z.number().int(),
  balanceAfter: z.number().int().optional(),
  watchId: z.string().optional(),
  orderId: z.string().optional(),
  serviceRequestId: z.string().optional(),
  actorUserId: z.string().optional(),
  sourceType: z.string().optional(),
  sourceId: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.date(),
  strapVariant: z.unknown()
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