import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const TaskItemChecklistSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistSumOrderByAggregateInput>;
export const TaskItemChecklistSumOrderByAggregateInputObjectZodSchema = makeSchema();
