import * as z from 'zod';
export const StrapInventoryMovementFindFirstResultSchema = z.nullable(z.object({
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
}));