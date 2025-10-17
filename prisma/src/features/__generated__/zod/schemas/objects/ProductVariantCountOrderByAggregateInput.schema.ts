import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  sku: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  price: SortOrderSchema.optional(),
  stockQty: SortOrderSchema.optional(),
  isStockManaged: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  maxQtyPerOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ProductVariantCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductVariantCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCountOrderByAggregateInput>;
export const ProductVariantCountOrderByAggregateInputObjectZodSchema = makeSchema();
