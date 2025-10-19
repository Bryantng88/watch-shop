import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ProductImageOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ProductImageOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageOrderByRelationAggregateInput>;
export const ProductImageOrderByRelationAggregateInputObjectZodSchema = makeSchema();
