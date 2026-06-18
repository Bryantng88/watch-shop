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
export const TaskChecklistItemCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCountOrderByAggregateInput>;
export const TaskChecklistItemCountOrderByAggregateInputObjectZodSchema = makeSchema();
