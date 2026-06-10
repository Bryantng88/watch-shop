import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const TaskExecutionOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.TaskExecutionOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionOrderByRelationAggregateInput>;
export const TaskExecutionOrderByRelationAggregateInputObjectZodSchema = makeSchema();
