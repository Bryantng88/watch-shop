import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  variantId: z.boolean().optional(),
  claspType: z.boolean().optional(),
  widthMM: z.boolean().optional(),
  originType: z.boolean().optional(),
  brandName: z.boolean().optional(),
  color: z.boolean().optional(),
  finish: z.boolean().optional(),
  minStockQty: z.boolean().optional(),
  targetStockQty: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  ProductVariant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const ClaspVariantSpecSelectObjectSchema: z.ZodType<Prisma.ClaspVariantSpecSelect> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecSelect>;
export const ClaspVariantSpecSelectObjectZodSchema = makeSchema();
