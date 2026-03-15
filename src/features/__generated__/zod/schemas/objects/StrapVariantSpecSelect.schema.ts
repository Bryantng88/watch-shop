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
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const StrapVariantSpecSelectObjectSchema: z.ZodType<Prisma.StrapVariantSpecSelect> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecSelect>;
export const StrapVariantSpecSelectObjectZodSchema = makeSchema();
