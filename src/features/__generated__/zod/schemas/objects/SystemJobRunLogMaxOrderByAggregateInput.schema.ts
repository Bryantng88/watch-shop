import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  processorKey: SortOrderSchema.optional(),
  triggerSource: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  processedCount: SortOrderSchema.optional(),
  errorCount: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  startedAt: SortOrderSchema.optional(),
  finishedAt: SortOrderSchema.optional()
}).strict();
export const SystemJobRunLogMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobRunLogMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobRunLogMaxOrderByAggregateInput>;
export const SystemJobRunLogMaxOrderByAggregateInputObjectZodSchema = makeSchema();
