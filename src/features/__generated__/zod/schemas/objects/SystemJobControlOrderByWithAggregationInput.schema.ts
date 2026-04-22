import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SystemJobControlCountOrderByAggregateInputObjectSchema as SystemJobControlCountOrderByAggregateInputObjectSchema } from './SystemJobControlCountOrderByAggregateInput.schema';
import { SystemJobControlAvgOrderByAggregateInputObjectSchema as SystemJobControlAvgOrderByAggregateInputObjectSchema } from './SystemJobControlAvgOrderByAggregateInput.schema';
import { SystemJobControlMaxOrderByAggregateInputObjectSchema as SystemJobControlMaxOrderByAggregateInputObjectSchema } from './SystemJobControlMaxOrderByAggregateInput.schema';
import { SystemJobControlMinOrderByAggregateInputObjectSchema as SystemJobControlMinOrderByAggregateInputObjectSchema } from './SystemJobControlMinOrderByAggregateInput.schema';
import { SystemJobControlSumOrderByAggregateInputObjectSchema as SystemJobControlSumOrderByAggregateInputObjectSchema } from './SystemJobControlSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  key: SortOrderSchema.optional(),
  label: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  batchSize: SortOrderSchema.optional(),
  pausedReason: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: SortOrderSchema.optional(),
  updated_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => SystemJobControlCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => SystemJobControlAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => SystemJobControlMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => SystemJobControlMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => SystemJobControlSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const SystemJobControlOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SystemJobControlOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlOrderByWithAggregationInput>;
export const SystemJobControlOrderByWithAggregationInputObjectZodSchema = makeSchema();
