import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductImageSelectObjectSchema as ProductImageSelectObjectSchema } from './ProductImageSelect.schema';
import { ProductImageIncludeObjectSchema as ProductImageIncludeObjectSchema } from './ProductImageInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ProductImageSelectObjectSchema).optional(),
  include: z.lazy(() => ProductImageIncludeObjectSchema).optional()
}).strict();
export const ProductImageArgsObjectSchema = makeSchema();
export const ProductImageArgsObjectZodSchema = makeSchema();
