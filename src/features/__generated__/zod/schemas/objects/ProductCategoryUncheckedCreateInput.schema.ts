import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryScopeSchema } from '../enums/ProductCategoryScope.schema';
import { ProductUncheckedCreateNestedManyWithoutProductCategoryInputObjectSchema as ProductUncheckedCreateNestedManyWithoutProductCategoryInputObjectSchema } from './ProductUncheckedCreateNestedManyWithoutProductCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  scope: ProductCategoryScopeSchema.optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutProductCategoryInputObjectSchema)
}).strict();
export const ProductCategoryUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ProductCategoryUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUncheckedCreateInput>;
export const ProductCategoryUncheckedCreateInputObjectZodSchema = makeSchema();
