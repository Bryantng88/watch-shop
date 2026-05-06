import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  watchId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  targetType: z.literal(true).optional(),
  status: z.literal(true).optional(),
  submittedAt: z.literal(true).optional(),
  submittedById: z.literal(true).optional(),
  reviewedAt: z.literal(true).optional(),
  reviewedById: z.literal(true).optional(),
  reviewNote: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const WatchReviewStateMaxAggregateInputObjectSchema: z.ZodType<Prisma.WatchReviewStateMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateMaxAggregateInputType>;
export const WatchReviewStateMaxAggregateInputObjectZodSchema = makeSchema();
