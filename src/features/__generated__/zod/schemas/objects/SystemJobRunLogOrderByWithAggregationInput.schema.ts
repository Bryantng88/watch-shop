import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SystemJobRunLogCountOrderByAggregateInputObjectSchema as SystemJobRunLogCountOrderByAggregateInputObjectSchema } from './SystemJobRunLogCountOrderByAggregateInput.schema';
import { SystemJobRunLogAvgOrderByAggregateInputObjectSchema as SystemJobRunLogAvgOrderByAggregateInputObjectSchema } from './SystemJobRunLogAvgOrderByAggregateInput.schema';
import { SystemJobRunLogMaxOrderByAggregateInputObjectSchema as SystemJobRunLogMaxOrderByAggregateInputObjectSchema } from './SystemJobRunLogMaxOrderByAggregateInput.schema';
import { SystemJobRunLogMinOrderByAggregateInputObjectSchema as SystemJobRunLogMinOrderByAggregateInputObjectSchema } from './SystemJobRunLogMinOrderByAggregateInput.schema';
import { SystemJobRunLogSumOrderByAggregateInputObjectSchema as SystemJobRunLogSumOrderByAggregateInputObjectSchema } from './SystemJobRunLogSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  processorKey: SortOrderSchema.optional(),
  triggerSource: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  processedCount: SortOrderSchema.optional(),
  errorCount: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  detail: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  startedAt: SortOrderSchema.optional(),
  finishedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => SystemJobRunLogCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => SystemJobRunLogAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => SystemJobRunLogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => SystemJobRunLogMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => SystemJobRunLogSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const SystemJobRunLogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SystemJobRunLogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobRunLogOrderByWithAggregationInput>;
export const SystemJobRunLogOrderByWithAggregationInputObjectZodSchema = makeSchema();
