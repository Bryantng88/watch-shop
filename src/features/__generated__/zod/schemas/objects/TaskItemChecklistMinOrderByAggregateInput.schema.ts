import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskItemId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  isDone: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  doneAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional()
}).strict();
export const TaskItemChecklistMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistMinOrderByAggregateInput>;
export const TaskItemChecklistMinOrderByAggregateInputObjectZodSchema = makeSchema();
