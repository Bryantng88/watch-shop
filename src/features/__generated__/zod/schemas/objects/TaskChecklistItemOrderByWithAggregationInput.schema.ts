import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskChecklistItemCountOrderByAggregateInputObjectSchema as TaskChecklistItemCountOrderByAggregateInputObjectSchema } from './TaskChecklistItemCountOrderByAggregateInput.schema';
import { TaskChecklistItemAvgOrderByAggregateInputObjectSchema as TaskChecklistItemAvgOrderByAggregateInputObjectSchema } from './TaskChecklistItemAvgOrderByAggregateInput.schema';
import { TaskChecklistItemMaxOrderByAggregateInputObjectSchema as TaskChecklistItemMaxOrderByAggregateInputObjectSchema } from './TaskChecklistItemMaxOrderByAggregateInput.schema';
import { TaskChecklistItemMinOrderByAggregateInputObjectSchema as TaskChecklistItemMinOrderByAggregateInputObjectSchema } from './TaskChecklistItemMinOrderByAggregateInput.schema';
import { TaskChecklistItemSumOrderByAggregateInputObjectSchema as TaskChecklistItemSumOrderByAggregateInputObjectSchema } from './TaskChecklistItemSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  dueAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  assignedToUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  startedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  cancelledAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isDone: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => TaskChecklistItemCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TaskChecklistItemAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TaskChecklistItemMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TaskChecklistItemMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TaskChecklistItemSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TaskChecklistItemOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemOrderByWithAggregationInput>;
export const TaskChecklistItemOrderByWithAggregationInputObjectZodSchema = makeSchema();
