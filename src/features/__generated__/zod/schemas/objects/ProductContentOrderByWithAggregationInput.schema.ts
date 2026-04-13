import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductContentCountOrderByAggregateInputObjectSchema as ProductContentCountOrderByAggregateInputObjectSchema } from './ProductContentCountOrderByAggregateInput.schema';
import { ProductContentMaxOrderByAggregateInputObjectSchema as ProductContentMaxOrderByAggregateInputObjectSchema } from './ProductContentMaxOrderByAggregateInput.schema';
import { ProductContentMinOrderByAggregateInputObjectSchema as ProductContentMinOrderByAggregateInputObjectSchema } from './ProductContentMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  productId: SortOrderSchema.optional(),
  titleSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  brandSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  refSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sizeSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movementSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  glassSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  strapClaspSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  modelSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  yearSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  generatedContent: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  promptNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  generatedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  specBullets: SortOrderSchema.optional(),
  hashtags: SortOrderSchema.optional(),
  _count: z.lazy(() => ProductContentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ProductContentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ProductContentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ProductContentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ProductContentOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentOrderByWithAggregationInput>;
export const ProductContentOrderByWithAggregationInputObjectZodSchema = makeSchema();
