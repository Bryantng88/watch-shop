import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  fileKey: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  alt: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional(),
  mime: SortOrderSchema.optional(),
  sizeBytes: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  dominantHex: SortOrderSchema.optional(),
  contentHash: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ProductImageCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductImageCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageCountOrderByAggregateInput>;
export const ProductImageCountOrderByAggregateInputObjectZodSchema = makeSchema();
