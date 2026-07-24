import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  serviceExpectedWorkingDays: SortOrderSchema.optional()
}).strict();
export const WatchAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchAvgOrderByAggregateInput>;
export const WatchAvgOrderByAggregateInputObjectZodSchema = makeSchema();
