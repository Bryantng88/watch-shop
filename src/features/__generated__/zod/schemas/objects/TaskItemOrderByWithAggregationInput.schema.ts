import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskItemCountOrderByAggregateInputObjectSchema as TaskItemCountOrderByAggregateInputObjectSchema } from './TaskItemCountOrderByAggregateInput.schema';
import { TaskItemAvgOrderByAggregateInputObjectSchema as TaskItemAvgOrderByAggregateInputObjectSchema } from './TaskItemAvgOrderByAggregateInput.schema';
import { TaskItemMaxOrderByAggregateInputObjectSchema as TaskItemMaxOrderByAggregateInputObjectSchema } from './TaskItemMaxOrderByAggregateInput.schema';
import { TaskItemMinOrderByAggregateInputObjectSchema as TaskItemMinOrderByAggregateInputObjectSchema } from './TaskItemMinOrderByAggregateInput.schema';
import { TaskItemSumOrderByAggregateInputObjectSchema as TaskItemSumOrderByAggregateInputObjectSchema } from './TaskItemSumOrderByAggregateInput.schema'

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
  _count: z.lazy(() => TaskItemCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TaskItemAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TaskItemMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TaskItemMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TaskItemSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TaskItemOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TaskItemOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemOrderByWithAggregationInput>;
export const TaskItemOrderByWithAggregationInputObjectZodSchema = makeSchema();
