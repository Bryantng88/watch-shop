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
export const TaskItemChecklistCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistCountOrderByAggregateInput>;
export const TaskItemChecklistCountOrderByAggregateInputObjectZodSchema = makeSchema();
