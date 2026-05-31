import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ProductPostTargetCountOrderByAggregateInputObjectSchema as ProductPostTargetCountOrderByAggregateInputObjectSchema } from './ProductPostTargetCountOrderByAggregateInput.schema';
import { ProductPostTargetMaxOrderByAggregateInputObjectSchema as ProductPostTargetMaxOrderByAggregateInputObjectSchema } from './ProductPostTargetMaxOrderByAggregateInput.schema';
import { ProductPostTargetMinOrderByAggregateInputObjectSchema as ProductPostTargetMinOrderByAggregateInputObjectSchema } from './ProductPostTargetMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  productId: SortOrderSchema.optional(),
  postTargetId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ProductPostTargetCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ProductPostTargetMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ProductPostTargetMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ProductPostTargetOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ProductPostTargetOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetOrderByWithAggregationInput>;
export const ProductPostTargetOrderByWithAggregationInputObjectZodSchema = makeSchema();
