import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const TaskItemChecklistAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistAvgOrderByAggregateInput>;
export const TaskItemChecklistAvgOrderByAggregateInputObjectZodSchema = makeSchema();
