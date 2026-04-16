import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryScopeSchema } from '../enums/ProductCategoryScope.schema'

const makeSchema = () => z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  scope: ProductCategoryScopeSchema.optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ProductCategoryCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductCategoryCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCreateWithoutProductInput>;
export const ProductCategoryCreateWithoutProductInputObjectZodSchema = makeSchema();
