import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  submittedAt: SortOrderSchema.optional(),
  submittedById: SortOrderSchema.optional(),
  reviewedAt: SortOrderSchema.optional(),
  reviewedById: SortOrderSchema.optional(),
  reviewNote: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WatchReviewStateMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchReviewStateMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateMinOrderByAggregateInput>;
export const WatchReviewStateMinOrderByAggregateInputObjectZodSchema = makeSchema();
