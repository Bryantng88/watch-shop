import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const TaskOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.TaskOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskOrderByRelationAggregateInput>;
export const TaskOrderByRelationAggregateInputObjectZodSchema = makeSchema();
