import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  processed_count: SortOrderSchema.optional(),
  error_count: SortOrderSchema.optional()
}).strict();
export const system_job_run_logAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.system_job_run_logAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_run_logAvgOrderByAggregateInput>;
export const system_job_run_logAvgOrderByAggregateInputObjectZodSchema = makeSchema();
