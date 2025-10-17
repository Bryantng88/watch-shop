import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ComplicationOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ComplicationOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationOrderByRelationAggregateInput>;
export const ComplicationOrderByRelationAggregateInputObjectZodSchema = makeSchema();
