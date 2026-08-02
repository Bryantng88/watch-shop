import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  ProductVariant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const ClaspVariantSpecIncludeObjectSchema: z.ZodType<Prisma.ClaspVariantSpecInclude> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecInclude>;
export const ClaspVariantSpecIncludeObjectZodSchema = makeSchema();
