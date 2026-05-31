import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ProductPostTargetOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ProductPostTargetOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetOrderByRelationAggregateInput>;
export const ProductPostTargetOrderByRelationAggregateInputObjectZodSchema = makeSchema();
