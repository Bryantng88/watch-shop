import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductFindManySchema as ProductFindManySchema } from '../findManyProduct.schema';
import { ProductCategoryCountOutputTypeArgsObjectSchema as ProductCategoryCountOutputTypeArgsObjectSchema } from './ProductCategoryCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  Product: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProductCategoryCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProductCategoryIncludeObjectSchema: z.ZodType<Prisma.ProductCategoryInclude> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryInclude>;
export const ProductCategoryIncludeObjectZodSchema = makeSchema();
