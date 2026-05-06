import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const WatchReviewLogOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.WatchReviewLogOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogOrderByRelationAggregateInput>;
export const WatchReviewLogOrderByRelationAggregateInputObjectZodSchema = makeSchema();
