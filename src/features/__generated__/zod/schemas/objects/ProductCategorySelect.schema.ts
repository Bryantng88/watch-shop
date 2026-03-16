import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductFindManySchema as ProductFindManySchema } from '../findManyProduct.schema';
import { ProductCategoryCountOutputTypeArgsObjectSchema as ProductCategoryCountOutputTypeArgsObjectSchema } from './ProductCategoryCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  scope: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Product: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProductCategoryCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProductCategorySelectObjectSchema: z.ZodType<Prisma.ProductCategorySelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategorySelect>;
export const ProductCategorySelectObjectZodSchema = makeSchema();
