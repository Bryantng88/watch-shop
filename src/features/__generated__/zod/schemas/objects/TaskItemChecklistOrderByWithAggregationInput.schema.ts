import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskItemChecklistCountOrderByAggregateInputObjectSchema as TaskItemChecklistCountOrderByAggregateInputObjectSchema } from './TaskItemChecklistCountOrderByAggregateInput.schema';
import { TaskItemChecklistAvgOrderByAggregateInputObjectSchema as TaskItemChecklistAvgOrderByAggregateInputObjectSchema } from './TaskItemChecklistAvgOrderByAggregateInput.schema';
import { TaskItemChecklistMaxOrderByAggregateInputObjectSchema as TaskItemChecklistMaxOrderByAggregateInputObjectSchema } from './TaskItemChecklistMaxOrderByAggregateInput.schema';
import { TaskItemChecklistMinOrderByAggregateInputObjectSchema as TaskItemChecklistMinOrderByAggregateInputObjectSchema } from './TaskItemChecklistMinOrderByAggregateInput.schema';
import { TaskItemChecklistSumOrderByAggregateInputObjectSchema as TaskItemChecklistSumOrderByAggregateInputObjectSchema } from './TaskItemChecklistSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskItemId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isDone: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  doneAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  taskId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => TaskItemChecklistCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TaskItemChecklistAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TaskItemChecklistMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TaskItemChecklistMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TaskItemChecklistSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TaskItemChecklistOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistOrderByWithAggregationInput>;
export const TaskItemChecklistOrderByWithAggregationInputObjectZodSchema = makeSchema();
