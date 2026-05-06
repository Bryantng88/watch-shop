import * as z from 'zod';
export const WatchReviewStateCreateResultSchema = z.object({
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
});