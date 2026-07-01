import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskItemId: SortOrderSchema.optional(),
  sourceType: SortOrderSchema.optional(),
  sourceId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  body: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  actorUserId: SortOrderSchema.optional(),
  occurredAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const TaskItemActivityMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityMinOrderByAggregateInput>;
export const TaskItemActivityMinOrderByAggregateInputObjectZodSchema = makeSchema();
