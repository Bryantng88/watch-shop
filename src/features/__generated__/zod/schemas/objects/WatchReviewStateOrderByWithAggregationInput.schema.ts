import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchReviewStateCountOrderByAggregateInputObjectSchema as WatchReviewStateCountOrderByAggregateInputObjectSchema } from './WatchReviewStateCountOrderByAggregateInput.schema';
import { WatchReviewStateMaxOrderByAggregateInputObjectSchema as WatchReviewStateMaxOrderByAggregateInputObjectSchema } from './WatchReviewStateMaxOrderByAggregateInput.schema';
import { WatchReviewStateMinOrderByAggregateInputObjectSchema as WatchReviewStateMinOrderByAggregateInputObjectSchema } from './WatchReviewStateMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  submittedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  submittedById: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reviewedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reviewedById: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reviewNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WatchReviewStateCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WatchReviewStateMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WatchReviewStateMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WatchReviewStateOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WatchReviewStateOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateOrderByWithAggregationInput>;
export const WatchReviewStateOrderByWithAggregationInputObjectZodSchema = makeSchema();
