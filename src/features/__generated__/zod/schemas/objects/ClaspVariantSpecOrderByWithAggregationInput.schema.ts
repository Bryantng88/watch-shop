import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ClaspVariantSpecCountOrderByAggregateInputObjectSchema as ClaspVariantSpecCountOrderByAggregateInputObjectSchema } from './ClaspVariantSpecCountOrderByAggregateInput.schema';
import { ClaspVariantSpecAvgOrderByAggregateInputObjectSchema as ClaspVariantSpecAvgOrderByAggregateInputObjectSchema } from './ClaspVariantSpecAvgOrderByAggregateInput.schema';
import { ClaspVariantSpecMaxOrderByAggregateInputObjectSchema as ClaspVariantSpecMaxOrderByAggregateInputObjectSchema } from './ClaspVariantSpecMaxOrderByAggregateInput.schema';
import { ClaspVariantSpecMinOrderByAggregateInputObjectSchema as ClaspVariantSpecMinOrderByAggregateInputObjectSchema } from './ClaspVariantSpecMinOrderByAggregateInput.schema';
import { ClaspVariantSpecSumOrderByAggregateInputObjectSchema as ClaspVariantSpecSumOrderByAggregateInputObjectSchema } from './ClaspVariantSpecSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  variantId: SortOrderSchema.optional(),
  claspType: SortOrderSchema.optional(),
  widthMM: SortOrderSchema.optional(),
  originType: SortOrderSchema.optional(),
  brandName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  finish: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  minStockQty: SortOrderSchema.optional(),
  targetStockQty: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ClaspVariantSpecCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ClaspVariantSpecAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ClaspVariantSpecMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ClaspVariantSpecMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ClaspVariantSpecSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ClaspVariantSpecOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecOrderByWithAggregationInput>;
export const ClaspVariantSpecOrderByWithAggregationInputObjectZodSchema = makeSchema();
