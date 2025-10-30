import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  sku: z.literal(true).optional(),
  name: z.literal(true).optional(),
  price: z.literal(true).optional(),
  stockQty: z.literal(true).optional(),
  isStockManaged: z.literal(true).optional(),
  maxQtyPerOrder: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  availabilityStatuts: z.literal(true).optional()
}).strict();
export const ProductVariantMaxAggregateInputObjectSchema: z.ZodType<Prisma.ProductVariantMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantMaxAggregateInputType>;
export const ProductVariantMaxAggregateInputObjectZodSchema = makeSchema();
