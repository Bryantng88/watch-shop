import * as z from 'zod';
export const WatchReviewLogCreateResultSchema = z.object({
  id: z.string(),
  reviewStateId: z.string(),
  action: z.unknown(),
  fromStatus: z.unknown().optional(),
  toStatus: z.unknown(),
  actorId: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.date(),
  reviewState: z.unknown()
});