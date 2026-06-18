import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  isDone: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const TaskChecklistItemMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemMaxOrderByAggregateInput>;
export const TaskChecklistItemMaxOrderByAggregateInputObjectZodSchema = makeSchema();
