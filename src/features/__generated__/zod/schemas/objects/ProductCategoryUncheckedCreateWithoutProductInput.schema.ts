import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryScopeSchema } from '../enums/ProductCategoryScope.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  scope: ProductCategoryScopeSchema.optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ProductCategoryUncheckedCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductCategoryUncheckedCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUncheckedCreateWithoutProductInput>;
export const ProductCategoryUncheckedCreateWithoutProductInputObjectZodSchema = makeSchema();
