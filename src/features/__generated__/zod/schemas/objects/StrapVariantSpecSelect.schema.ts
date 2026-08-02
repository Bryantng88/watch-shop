import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  variantId: z.boolean().optional(),
  color: z.boolean().optional(),
  material: z.boolean().optional(),
  quickRelease: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  lugWidthMM: z.boolean().optional(),
  buckleWidthMM: z.boolean().optional(),
  originType: z.boolean().optional(),
  brandName: z.boolean().optional(),
  leatherType: z.boolean().optional(),
  surface: z.boolean().optional(),
  inventoryPolicy: z.boolean().optional(),
  claspType: z.boolean().optional(),
  claspWidthMM: z.boolean().optional(),
  claspOriginType: z.boolean().optional(),
  finish: z.boolean().optional(),
  lengthClass: z.boolean().optional(),
  minStockQty: z.boolean().optional(),
  targetStockQty: z.boolean().optional(),
  braceletReference: z.boolean().optional(),
  defaultFullLinks: z.boolean().optional(),
  defaultHalfLinks: z.boolean().optional(),
  defaultEndLinks: z.boolean().optional(),
  ProductVariant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const StrapVariantSpecSelectObjectSchema: z.ZodType<Prisma.StrapVariantSpecSelect> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecSelect>;
export const StrapVariantSpecSelectObjectZodSchema = makeSchema();
