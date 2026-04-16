import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ProductVariantOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ProductVariantOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantOrderByRelationAggregateInput>;
export const ProductVariantOrderByRelationAggregateInputObjectZodSchema = makeSchema();
