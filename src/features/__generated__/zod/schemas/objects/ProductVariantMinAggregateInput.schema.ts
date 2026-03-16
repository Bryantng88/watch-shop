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
  availabilityStatus: z.literal(true).optional(),
  listPrice: z.literal(true).optional(),
  discountType: z.literal(true).optional(),
  discountValue: z.literal(true).optional(),
  salePrice: z.literal(true).optional(),
  saleStartsAt: z.literal(true).optional(),
  saleEndsAt: z.literal(true).optional(),
  costPrice: z.literal(true).optional()
}).strict();
export const ProductVariantMinAggregateInputObjectSchema: z.ZodType<Prisma.ProductVariantMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantMinAggregateInputType>;
export const ProductVariantMinAggregateInputObjectZodSchema = makeSchema();
