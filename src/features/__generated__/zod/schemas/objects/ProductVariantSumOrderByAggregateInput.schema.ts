import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  price: SortOrderSchema.optional(),
  stockQty: SortOrderSchema.optional(),
  maxQtyPerOrder: SortOrderSchema.optional()
}).strict();
export const ProductVariantSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductVariantSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantSumOrderByAggregateInput>;
export const ProductVariantSumOrderByAggregateInputObjectZodSchema = makeSchema();
