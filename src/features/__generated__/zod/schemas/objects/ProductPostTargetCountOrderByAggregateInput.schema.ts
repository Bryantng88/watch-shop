import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  productId: SortOrderSchema.optional(),
  postTargetId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const ProductPostTargetCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductPostTargetCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCountOrderByAggregateInput>;
export const ProductPostTargetCountOrderByAggregateInputObjectZodSchema = makeSchema();
