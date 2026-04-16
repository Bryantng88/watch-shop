import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategorySelectObjectSchema as ProductCategorySelectObjectSchema } from './ProductCategorySelect.schema';
import { ProductCategoryIncludeObjectSchema as ProductCategoryIncludeObjectSchema } from './ProductCategoryInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ProductCategorySelectObjectSchema).optional(),
  include: z.lazy(() => ProductCategoryIncludeObjectSchema).optional()
}).strict();
export const ProductCategoryArgsObjectSchema = makeSchema();
export const ProductCategoryArgsObjectZodSchema = makeSchema();
