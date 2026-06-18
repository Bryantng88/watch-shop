import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskExecutionCountOrderByAggregateInputObjectSchema as TaskExecutionCountOrderByAggregateInputObjectSchema } from './TaskExecutionCountOrderByAggregateInput.schema';
import { TaskExecutionMaxOrderByAggregateInputObjectSchema as TaskExecutionMaxOrderByAggregateInputObjectSchema } from './TaskExecutionMaxOrderByAggregateInput.schema';
import { TaskExecutionMinOrderByAggregateInputObjectSchema as TaskExecutionMinOrderByAggregateInputObjectSchema } from './TaskExecutionMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actionType: SortOrderSchema.optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  checklistItemId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  technicalIssueId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => TaskExecutionCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TaskExecutionMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TaskExecutionMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TaskExecutionOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TaskExecutionOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionOrderByWithAggregationInput>;
export const TaskExecutionOrderByWithAggregationInputObjectZodSchema = makeSchema();
