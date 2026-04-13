import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { system_job_controlCountOrderByAggregateInputObjectSchema as system_job_controlCountOrderByAggregateInputObjectSchema } from './system_job_controlCountOrderByAggregateInput.schema';
import { system_job_controlAvgOrderByAggregateInputObjectSchema as system_job_controlAvgOrderByAggregateInputObjectSchema } from './system_job_controlAvgOrderByAggregateInput.schema';
import { system_job_controlMaxOrderByAggregateInputObjectSchema as system_job_controlMaxOrderByAggregateInputObjectSchema } from './system_job_controlMaxOrderByAggregateInput.schema';
import { system_job_controlMinOrderByAggregateInputObjectSchema as system_job_controlMinOrderByAggregateInputObjectSchema } from './system_job_controlMinOrderByAggregateInput.schema';
import { system_job_controlSumOrderByAggregateInputObjectSchema as system_job_controlSumOrderByAggregateInputObjectSchema } from './system_job_controlSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  key: SortOrderSchema.optional(),
  label: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  batch_size: SortOrderSchema.optional(),
  paused_reason: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: SortOrderSchema.optional(),
  updated_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => system_job_controlCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => system_job_controlAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => system_job_controlMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => system_job_controlMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => system_job_controlSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const system_job_controlOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.system_job_controlOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_controlOrderByWithAggregationInput>;
export const system_job_controlOrderByWithAggregationInputObjectZodSchema = makeSchema();
