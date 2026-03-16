import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  price: z.literal(true).optional(),
  stockQty: z.literal(true).optional(),
  maxQtyPerOrder: z.literal(true).optional(),
  listPrice: z.literal(true).optional(),
  discountValue: z.literal(true).optional(),
  salePrice: z.literal(true).optional(),
  costPrice: z.literal(true).optional()
}).strict();
export const ProductVariantAvgAggregateInputObjectSchema: z.ZodType<Prisma.ProductVariantAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantAvgAggregateInputType>;
export const ProductVariantAvgAggregateInputObjectZodSchema = makeSchema();
