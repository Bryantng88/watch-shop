import * as z from 'zod';
export const WatchReviewLogFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  reviewStateId: z.string(),
  action: z.unknown(),
  fromStatus: z.unknown().optional(),
  toStatus: z.unknown(),
  actorId: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.date(),
  reviewState: z.unknown()
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