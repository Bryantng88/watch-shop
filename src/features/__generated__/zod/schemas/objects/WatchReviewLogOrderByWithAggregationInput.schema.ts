import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchReviewLogCountOrderByAggregateInputObjectSchema as WatchReviewLogCountOrderByAggregateInputObjectSchema } from './WatchReviewLogCountOrderByAggregateInput.schema';
import { WatchReviewLogMaxOrderByAggregateInputObjectSchema as WatchReviewLogMaxOrderByAggregateInputObjectSchema } from './WatchReviewLogMaxOrderByAggregateInput.schema';
import { WatchReviewLogMinOrderByAggregateInputObjectSchema as WatchReviewLogMinOrderByAggregateInputObjectSchema } from './WatchReviewLogMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  reviewStateId: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  fromStatus: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  toStatus: SortOrderSchema.optional(),
  actorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WatchReviewLogCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WatchReviewLogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WatchReviewLogMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WatchReviewLogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WatchReviewLogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogOrderByWithAggregationInput>;
export const WatchReviewLogOrderByWithAggregationInputObjectZodSchema = makeSchema();
