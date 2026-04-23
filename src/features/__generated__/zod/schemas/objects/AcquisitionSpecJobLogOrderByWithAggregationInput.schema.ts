import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionSpecJobLogCountOrderByAggregateInputObjectSchema as AcquisitionSpecJobLogCountOrderByAggregateInputObjectSchema } from './AcquisitionSpecJobLogCountOrderByAggregateInput.schema';
import { AcquisitionSpecJobLogMaxOrderByAggregateInputObjectSchema as AcquisitionSpecJobLogMaxOrderByAggregateInputObjectSchema } from './AcquisitionSpecJobLogMaxOrderByAggregateInput.schema';
import { AcquisitionSpecJobLogMinOrderByAggregateInputObjectSchema as AcquisitionSpecJobLogMinOrderByAggregateInputObjectSchema } from './AcquisitionSpecJobLogMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  acquisitionSpecJobId: SortOrderSchema.optional(),
  acquisitionItemId: SortOrderSchema.optional(),
  acquisitionId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  stage: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  message: SortOrderSchema.optional(),
  payload: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => AcquisitionSpecJobLogCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AcquisitionSpecJobLogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AcquisitionSpecJobLogMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobLogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogOrderByWithAggregationInput>;
export const AcquisitionSpecJobLogOrderByWithAggregationInputObjectZodSchema = makeSchema();
