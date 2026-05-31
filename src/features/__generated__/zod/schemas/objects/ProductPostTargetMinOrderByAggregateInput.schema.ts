import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  productId: SortOrderSchema.optional(),
  postTargetId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const ProductPostTargetMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductPostTargetMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetMinOrderByAggregateInput>;
export const ProductPostTargetMinOrderByAggregateInputObjectZodSchema = makeSchema();
