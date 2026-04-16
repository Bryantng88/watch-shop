import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ProductOrderByRelationAggregateInputObjectSchema as ProductOrderByRelationAggregateInputObjectSchema } from './ProductOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  scope: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  Product: z.lazy(() => ProductOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const ProductCategoryOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ProductCategoryOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryOrderByWithRelationInput>;
export const ProductCategoryOrderByWithRelationInputObjectZodSchema = makeSchema();
