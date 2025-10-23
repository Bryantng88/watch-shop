import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  slug: z.literal(true).optional(),
  title: z.literal(true).optional(),
  status: z.literal(true).optional(),
  primaryImageUrl: z.literal(true).optional(),
  type: z.literal(true).optional(),
  brandId: z.literal(true).optional(),
  seoTitle: z.literal(true).optional(),
  seoDescription: z.literal(true).optional(),
  isStockManaged: z.literal(true).optional(),
  maxQtyPerOrder: z.literal(true).optional(),
  publishedAt: z.literal(true).optional(),
  vendorId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  tag: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ProductCountAggregateInputObjectSchema: z.ZodType<Prisma.ProductCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductCountAggregateInputType>;
export const ProductCountAggregateInputObjectZodSchema = makeSchema();
