import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional(),
  sizeBytes: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional()
}).strict();
export const ProductImageAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductImageAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageAvgOrderByAggregateInput>;
export const ProductImageAvgOrderByAggregateInputObjectZodSchema = makeSchema();
