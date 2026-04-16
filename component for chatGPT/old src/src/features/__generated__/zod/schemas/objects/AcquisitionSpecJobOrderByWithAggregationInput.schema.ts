import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionSpecJobCountOrderByAggregateInputObjectSchema as AcquisitionSpecJobCountOrderByAggregateInputObjectSchema } from './AcquisitionSpecJobCountOrderByAggregateInput.schema';
import { AcquisitionSpecJobAvgOrderByAggregateInputObjectSchema as AcquisitionSpecJobAvgOrderByAggregateInputObjectSchema } from './AcquisitionSpecJobAvgOrderByAggregateInput.schema';
import { AcquisitionSpecJobMaxOrderByAggregateInputObjectSchema as AcquisitionSpecJobMaxOrderByAggregateInputObjectSchema } from './AcquisitionSpecJobMaxOrderByAggregateInput.schema';
import { AcquisitionSpecJobMinOrderByAggregateInputObjectSchema as AcquisitionSpecJobMinOrderByAggregateInputObjectSchema } from './AcquisitionSpecJobMinOrderByAggregateInput.schema';
import { AcquisitionSpecJobSumOrderByAggregateInputObjectSchema as AcquisitionSpecJobSumOrderByAggregateInputObjectSchema } from './AcquisitionSpecJobSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  acquisitionItemId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  attempts: SortOrderSchema.optional(),
  lastError: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  startedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  finishedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  runAfter: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  priority: SortOrderSchema.optional(),
  _count: z.lazy(() => AcquisitionSpecJobCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => AcquisitionSpecJobAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AcquisitionSpecJobMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AcquisitionSpecJobMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => AcquisitionSpecJobSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobOrderByWithAggregationInput>;
export const AcquisitionSpecJobOrderByWithAggregationInputObjectZodSchema = makeSchema();
