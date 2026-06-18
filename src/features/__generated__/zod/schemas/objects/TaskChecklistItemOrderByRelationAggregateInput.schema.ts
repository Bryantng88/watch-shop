import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const TaskChecklistItemOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemOrderByRelationAggregateInput>;
export const TaskChecklistItemOrderByRelationAggregateInputObjectZodSchema = makeSchema();
