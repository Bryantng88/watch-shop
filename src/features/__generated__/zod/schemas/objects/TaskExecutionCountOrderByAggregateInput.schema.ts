import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actionType: SortOrderSchema.optional(),
  metadataJson: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  createdByUserId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const TaskExecutionCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskExecutionCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCountOrderByAggregateInput>;
export const TaskExecutionCountOrderByAggregateInputObjectZodSchema = makeSchema();
