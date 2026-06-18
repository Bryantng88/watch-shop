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
export const TaskChecklistItemMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemMinOrderByAggregateInput>;
export const TaskChecklistItemMinOrderByAggregateInputObjectZodSchema = makeSchema();
