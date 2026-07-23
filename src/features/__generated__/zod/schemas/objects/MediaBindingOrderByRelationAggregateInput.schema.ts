import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const MediaBindingOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.MediaBindingOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingOrderByRelationAggregateInput>;
export const MediaBindingOrderByRelationAggregateInputObjectZodSchema = makeSchema();
