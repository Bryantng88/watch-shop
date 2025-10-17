import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantSelectObjectSchema as ProductVariantSelectObjectSchema } from './ProductVariantSelect.schema';
import { ProductVariantIncludeObjectSchema as ProductVariantIncludeObjectSchema } from './ProductVariantInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ProductVariantSelectObjectSchema).optional(),
  include: z.lazy(() => ProductVariantIncludeObjectSchema).optional()
}).strict();
export const ProductVariantArgsObjectSchema = makeSchema();
export const ProductVariantArgsObjectZodSchema = makeSchema();
