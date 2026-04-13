import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { system_job_run_logCountOrderByAggregateInputObjectSchema as system_job_run_logCountOrderByAggregateInputObjectSchema } from './system_job_run_logCountOrderByAggregateInput.schema';
import { system_job_run_logAvgOrderByAggregateInputObjectSchema as system_job_run_logAvgOrderByAggregateInputObjectSchema } from './system_job_run_logAvgOrderByAggregateInput.schema';
import { system_job_run_logMaxOrderByAggregateInputObjectSchema as system_job_run_logMaxOrderByAggregateInputObjectSchema } from './system_job_run_logMaxOrderByAggregateInput.schema';
import { system_job_run_logMinOrderByAggregateInputObjectSchema as system_job_run_logMinOrderByAggregateInputObjectSchema } from './system_job_run_logMinOrderByAggregateInput.schema';
import { system_job_run_logSumOrderByAggregateInputObjectSchema as system_job_run_logSumOrderByAggregateInputObjectSchema } from './system_job_run_logSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  processor_key: SortOrderSchema.optional(),
  trigger_source: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  processed_count: SortOrderSchema.optional(),
  error_count: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  detail: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  started_at: SortOrderSchema.optional(),
  finished_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => system_job_run_logCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => system_job_run_logAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => system_job_run_logMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => system_job_run_logMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => system_job_run_logSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const system_job_run_logOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.system_job_run_logOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_run_logOrderByWithAggregationInput>;
export const system_job_run_logOrderByWithAggregationInputObjectZodSchema = makeSchema();
