import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  serviceExpectedWorkingDays: SortOrderSchema.optional()
}).strict();
export const WatchSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSumOrderByAggregateInput>;
export const WatchSumOrderByAggregateInputObjectZodSchema = makeSchema();
