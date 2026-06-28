import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const AppTagOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.AppTagOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagOrderByRelationAggregateInput>;
export const AppTagOrderByRelationAggregateInputObjectZodSchema = makeSchema();
