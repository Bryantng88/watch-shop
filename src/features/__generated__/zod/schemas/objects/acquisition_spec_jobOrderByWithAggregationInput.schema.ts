import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { acquisition_spec_jobCountOrderByAggregateInputObjectSchema as acquisition_spec_jobCountOrderByAggregateInputObjectSchema } from './acquisition_spec_jobCountOrderByAggregateInput.schema';
import { acquisition_spec_jobAvgOrderByAggregateInputObjectSchema as acquisition_spec_jobAvgOrderByAggregateInputObjectSchema } from './acquisition_spec_jobAvgOrderByAggregateInput.schema';
import { acquisition_spec_jobMaxOrderByAggregateInputObjectSchema as acquisition_spec_jobMaxOrderByAggregateInputObjectSchema } from './acquisition_spec_jobMaxOrderByAggregateInput.schema';
import { acquisition_spec_jobMinOrderByAggregateInputObjectSchema as acquisition_spec_jobMinOrderByAggregateInputObjectSchema } from './acquisition_spec_jobMinOrderByAggregateInput.schema';
import { acquisition_spec_jobSumOrderByAggregateInputObjectSchema as acquisition_spec_jobSumOrderByAggregateInputObjectSchema } from './acquisition_spec_jobSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  acquisition_item_id: SortOrderSchema.optional(),
  product_id: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  attempts: SortOrderSchema.optional(),
  last_error: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  priority: SortOrderSchema.optional(),
  run_after: SortOrderSchema.optional(),
  started_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  finished_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => acquisition_spec_jobCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => acquisition_spec_jobAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => acquisition_spec_jobMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => acquisition_spec_jobMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => acquisition_spec_jobSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const acquisition_spec_jobOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.acquisition_spec_jobOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.acquisition_spec_jobOrderByWithAggregationInput>;
export const acquisition_spec_jobOrderByWithAggregationInputObjectZodSchema = makeSchema();
