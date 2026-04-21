import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryScopeSchema } from '../enums/ProductCategoryScope.schema';
import { ProductCreateNestedManyWithoutProductCategoryInputObjectSchema as ProductCreateNestedManyWithoutProductCategoryInputObjectSchema } from './ProductCreateNestedManyWithoutProductCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  scope: ProductCategoryScopeSchema.optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutProductCategoryInputObjectSchema)
}).strict();
export const ProductCategoryCreateInputObjectSchema: z.ZodType<Prisma.ProductCategoryCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCreateInput>;
export const ProductCategoryCreateInputObjectZodSchema = makeSchema();
