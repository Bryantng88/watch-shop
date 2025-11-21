import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionItemCountOrderByAggregateInputObjectSchema as AcquisitionItemCountOrderByAggregateInputObjectSchema } from './AcquisitionItemCountOrderByAggregateInput.schema';
import { AcquisitionItemAvgOrderByAggregateInputObjectSchema as AcquisitionItemAvgOrderByAggregateInputObjectSchema } from './AcquisitionItemAvgOrderByAggregateInput.schema';
import { AcquisitionItemMaxOrderByAggregateInputObjectSchema as AcquisitionItemMaxOrderByAggregateInputObjectSchema } from './AcquisitionItemMaxOrderByAggregateInput.schema';
import { AcquisitionItemMinOrderByAggregateInputObjectSchema as AcquisitionItemMinOrderByAggregateInputObjectSchema } from './AcquisitionItemMinOrderByAggregateInput.schema';
import { AcquisitionItemSumOrderByAggregateInputObjectSchema as AcquisitionItemSumOrderByAggregateInputObjectSchema } from './AcquisitionItemSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  acquisitionId: SortOrderSchema.optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  variantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  quantity: SortOrderSchema.optional(),
  unitCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  currency: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sourceOrderItemId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  kind: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expectedReturnAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  returnedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorRmaNo: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  warrantyMonths: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  capitalizeToProduct: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  productType: SortOrderSchema.optional(),
  productTitle: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => AcquisitionItemCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => AcquisitionItemAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AcquisitionItemMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AcquisitionItemMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => AcquisitionItemSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AcquisitionItemOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AcquisitionItemOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemOrderByWithAggregationInput>;
export const AcquisitionItemOrderByWithAggregationInputObjectZodSchema = makeSchema();
