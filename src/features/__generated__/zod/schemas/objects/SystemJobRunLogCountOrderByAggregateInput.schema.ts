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
  detail: SortOrderSchema.optional(),
  startedAt: SortOrderSchema.optional(),
  finishedAt: SortOrderSchema.optional()
}).strict();
export const SystemJobRunLogCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobRunLogCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobRunLogCountOrderByAggregateInput>;
export const SystemJobRunLogCountOrderByAggregateInputObjectZodSchema = makeSchema();
