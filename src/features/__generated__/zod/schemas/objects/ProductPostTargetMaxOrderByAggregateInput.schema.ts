import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  productId: SortOrderSchema.optional(),
  postTargetId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const ProductPostTargetMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductPostTargetMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetMaxOrderByAggregateInput>;
export const ProductPostTargetMaxOrderByAggregateInputObjectZodSchema = makeSchema();
