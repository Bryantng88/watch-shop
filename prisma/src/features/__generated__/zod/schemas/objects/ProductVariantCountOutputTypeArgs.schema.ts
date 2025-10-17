import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCountOutputTypeSelectObjectSchema as ProductVariantCountOutputTypeSelectObjectSchema } from './ProductVariantCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ProductVariantCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ProductVariantCountOutputTypeArgsObjectSchema = makeSchema();
export const ProductVariantCountOutputTypeArgsObjectZodSchema = makeSchema();
