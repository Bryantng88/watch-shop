import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const TaskItemChecklistOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistOrderByRelationAggregateInput>;
export const TaskItemChecklistOrderByRelationAggregateInputObjectZodSchema = makeSchema();
