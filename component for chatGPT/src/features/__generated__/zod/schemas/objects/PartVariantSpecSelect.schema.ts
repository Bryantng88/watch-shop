import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  variantId: z.boolean().optional(),
  partType: z.boolean().optional(),
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const PartVariantSpecSelectObjectSchema: z.ZodType<Prisma.PartVariantSpecSelect> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecSelect>;
export const PartVariantSpecSelectObjectZodSchema = makeSchema();
