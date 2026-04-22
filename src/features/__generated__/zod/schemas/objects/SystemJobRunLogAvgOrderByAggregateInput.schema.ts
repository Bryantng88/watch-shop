import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  processedCount: SortOrderSchema.optional(),
  errorCount: SortOrderSchema.optional()
}).strict();
export const SystemJobRunLogAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobRunLogAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobRunLogAvgOrderByAggregateInput>;
export const SystemJobRunLogAvgOrderByAggregateInputObjectZodSchema = makeSchema();
