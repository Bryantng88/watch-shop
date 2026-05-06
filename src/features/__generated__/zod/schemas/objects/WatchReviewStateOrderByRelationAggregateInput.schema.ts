import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const WatchReviewStateOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.WatchReviewStateOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateOrderByRelationAggregateInput>;
export const WatchReviewStateOrderByRelationAggregateInputObjectZodSchema = makeSchema();
