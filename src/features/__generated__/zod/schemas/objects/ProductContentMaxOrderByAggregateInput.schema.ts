import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  productId: SortOrderSchema.optional(),
  titleSnapshot: SortOrderSchema.optional(),
  brandSnapshot: SortOrderSchema.optional(),
  refSnapshot: SortOrderSchema.optional(),
  sizeSnapshot: SortOrderSchema.optional(),
  movementSnapshot: SortOrderSchema.optional(),
  glassSnapshot: SortOrderSchema.optional(),
  strapClaspSnapshot: SortOrderSchema.optional(),
  modelSnapshot: SortOrderSchema.optional(),
  yearSnapshot: SortOrderSchema.optional(),
  generatedContent: SortOrderSchema.optional(),
  promptNote: SortOrderSchema.optional(),
  generatedAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ProductContentMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductContentMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentMaxOrderByAggregateInput>;
export const ProductContentMaxOrderByAggregateInputObjectZodSchema = makeSchema();
