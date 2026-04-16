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
export const system_job_run_logMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.system_job_run_logMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_run_logMaxOrderByAggregateInput>;
export const system_job_run_logMaxOrderByAggregateInputObjectZodSchema = makeSchema();
