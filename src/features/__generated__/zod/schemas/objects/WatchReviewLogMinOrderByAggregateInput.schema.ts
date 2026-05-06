import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  reviewStateId: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  fromStatus: SortOrderSchema.optional(),
  toStatus: SortOrderSchema.optional(),
  actorId: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const WatchReviewLogMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchReviewLogMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogMinOrderByAggregateInput>;
export const WatchReviewLogMinOrderByAggregateInputObjectZodSchema = makeSchema();
