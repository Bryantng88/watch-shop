import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  processor_key: SortOrderSchema.optional(),
  trigger_source: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  processed_count: SortOrderSchema.optional(),
  error_count: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  started_at: SortOrderSchema.optional(),
  finished_at: SortOrderSchema.optional()
}).strict();
export const system_job_run_logMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.system_job_run_logMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_run_logMinOrderByAggregateInput>;
export const system_job_run_logMinOrderByAggregateInputObjectZodSchema = makeSchema();
