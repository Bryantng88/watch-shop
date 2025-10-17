import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductImageCountOrderByAggregateInputObjectSchema as ProductImageCountOrderByAggregateInputObjectSchema } from './ProductImageCountOrderByAggregateInput.schema';
import { ProductImageAvgOrderByAggregateInputObjectSchema as ProductImageAvgOrderByAggregateInputObjectSchema } from './ProductImageAvgOrderByAggregateInput.schema';
import { ProductImageMaxOrderByAggregateInputObjectSchema as ProductImageMaxOrderByAggregateInputObjectSchema } from './ProductImageMaxOrderByAggregateInput.schema';
import { ProductImageMinOrderByAggregateInputObjectSchema as ProductImageMinOrderByAggregateInputObjectSchema } from './ProductImageMinOrderByAggregateInput.schema';
import { ProductImageSumOrderByAggregateInputObjectSchema as ProductImageSumOrderByAggregateInputObjectSchema } from './ProductImageSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  fileKey: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  alt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  width: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  height: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mime: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sizeBytes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  dominantHex: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  contentHash: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ProductImageCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ProductImageAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ProductImageMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ProductImageMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ProductImageSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ProductImageOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ProductImageOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageOrderByWithAggregationInput>;
export const ProductImageOrderByWithAggregationInputObjectZodSchema = makeSchema();
