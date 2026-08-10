import * as z from 'zod';
export const PurchaseRequestActivityFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  purchaseRequestId: z.string(),
  type: z.unknown(),
  note: z.string().optional(),
  actorUserId: z.string().optional(),
  followUpAt: z.date().optional(),
  createdAt: z.date(),
  purchaseRequest: z.unknown(),
  actor: z.unknown().optional()
}));