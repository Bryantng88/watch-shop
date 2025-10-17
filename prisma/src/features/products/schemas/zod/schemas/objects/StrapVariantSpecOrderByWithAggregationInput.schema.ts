import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StrapVariantSpecCountOrderByAggregateInputObjectSchema as StrapVariantSpecCountOrderByAggregateInputObjectSchema } from './StrapVariantSpecCountOrderByAggregateInput.schema';
import { StrapVariantSpecAvgOrderByAggregateInputObjectSchema as StrapVariantSpecAvgOrderByAggregateInputObjectSchema } from './StrapVariantSpecAvgOrderByAggregateInput.schema';
import { StrapVariantSpecMaxOrderByAggregateInputObjectSchema as StrapVariantSpecMaxOrderByAggregateInputObjectSchema } from './StrapVariantSpecMaxOrderByAggregateInput.schema';
import { StrapVariantSpecMinOrderByAggregateInputObjectSchema as StrapVariantSpecMinOrderByAggregateInputObjectSchema } from './StrapVariantSpecMinOrderByAggregateInput.schema';
import { StrapVariantSpecSumOrderByAggregateInputObjectSchema as StrapVariantSpecSumOrderByAggregateInputObjectSchema } from './StrapVariantSpecSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  variantId: SortOrderSchema.optional(),
  widthMM: SortOrderSchema.optional(),
  lengthLabel: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  material: SortOrderSchema.optional(),
  quickRelease: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => StrapVariantSpecCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => StrapVariantSpecAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => StrapVariantSpecMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => StrapVariantSpecMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => StrapVariantSpecSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const StrapVariantSpecOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecOrderByWithAggregationInput>;
export const StrapVariantSpecOrderByWithAggregationInputObjectZodSchema = makeSchema();
