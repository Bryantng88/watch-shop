import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actionType: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  createdByUserId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  checklistItemId: SortOrderSchema.optional()
}).strict();
export const TaskExecutionMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskExecutionMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionMinOrderByAggregateInput>;
export const TaskExecutionMinOrderByAggregateInputObjectZodSchema = makeSchema();
