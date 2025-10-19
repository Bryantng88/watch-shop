import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  price: SortOrderSchema.optional(),
  stockQty: SortOrderSchema.optional(),
  maxQtyPerOrder: SortOrderSchema.optional()
}).strict();
export const ProductVariantAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductVariantAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantAvgOrderByAggregateInput>;
export const ProductVariantAvgOrderByAggregateInputObjectZodSchema = makeSchema();
