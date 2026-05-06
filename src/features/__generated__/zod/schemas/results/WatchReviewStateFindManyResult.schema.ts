import * as z from 'zod';
export const WatchReviewStateFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  watchId: z.string(),
  productId: z.string(),
  targetType: z.unknown(),
  status: z.unknown(),
  submittedAt: z.date().optional(),
  submittedById: z.string().optional(),
  reviewedAt: z.date().optional(),
  reviewedById: z.string().optional(),
  reviewNote: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  watch: z.unknown(),
  WatchReviewLog: z.array(z.unknown())
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