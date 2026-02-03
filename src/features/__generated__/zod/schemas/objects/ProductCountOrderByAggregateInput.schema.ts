import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  slug: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  primaryImageUrl: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  priceVisibility: SortOrderSchema.optional(),
  brandId: SortOrderSchema.optional(),
  seoTitle: SortOrderSchema.optional(),
  seoDescription: SortOrderSchema.optional(),
  isStockManaged: SortOrderSchema.optional(),
  maxQtyPerOrder: SortOrderSchema.optional(),
  publishedAt: SortOrderSchema.optional(),
  vendorId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  tag: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const ProductCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCountOrderByAggregateInput>;
export const ProductCountOrderByAggregateInputObjectZodSchema = makeSchema();
