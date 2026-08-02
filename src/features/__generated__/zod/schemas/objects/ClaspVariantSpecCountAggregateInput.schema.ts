import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  variantId: z.literal(true).optional(),
  claspType: z.literal(true).optional(),
  widthMM: z.literal(true).optional(),
  originType: z.literal(true).optional(),
  brandName: z.literal(true).optional(),
  color: z.literal(true).optional(),
  finish: z.literal(true).optional(),
  minStockQty: z.literal(true).optional(),
  targetStockQty: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ClaspVariantSpecCountAggregateInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecCountAggregateInputType>;
export const ClaspVariantSpecCountAggregateInputObjectZodSchema = makeSchema();
