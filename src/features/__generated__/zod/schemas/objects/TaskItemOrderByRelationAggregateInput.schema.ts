import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const TaskItemOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemOrderByRelationAggregateInput>;
export const TaskItemOrderByRelationAggregateInputObjectZodSchema = makeSchema();
