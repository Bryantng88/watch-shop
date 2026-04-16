import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  scope: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ProductCategoryMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductCategoryMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryMinOrderByAggregateInput>;
export const ProductCategoryMinOrderByAggregateInputObjectZodSchema = makeSchema();
