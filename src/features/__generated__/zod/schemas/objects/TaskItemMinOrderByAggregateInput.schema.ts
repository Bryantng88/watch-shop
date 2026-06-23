import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  dueAt: SortOrderSchema.optional(),
  assignedToUserId: SortOrderSchema.optional(),
  startedAt: SortOrderSchema.optional(),
  completedAt: SortOrderSchema.optional(),
  cancelledAt: SortOrderSchema.optional(),
  isDone: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional()
}).strict();
export const TaskItemMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemMinOrderByAggregateInput>;
export const TaskItemMinOrderByAggregateInputObjectZodSchema = makeSchema();
