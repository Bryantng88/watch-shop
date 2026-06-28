import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkflowExecutionCountOrderByAggregateInputObjectSchema as WorkflowExecutionCountOrderByAggregateInputObjectSchema } from './WorkflowExecutionCountOrderByAggregateInput.schema';
import { WorkflowExecutionMaxOrderByAggregateInputObjectSchema as WorkflowExecutionMaxOrderByAggregateInputObjectSchema } from './WorkflowExecutionMaxOrderByAggregateInput.schema';
import { WorkflowExecutionMinOrderByAggregateInputObjectSchema as WorkflowExecutionMinOrderByAggregateInputObjectSchema } from './WorkflowExecutionMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workflowId: SortOrderSchema.optional(),
  actionTargetType: SortOrderSchema.optional(),
  actionTargetId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  errorMessage: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  startedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  failedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WorkflowExecutionCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WorkflowExecutionMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WorkflowExecutionMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionOrderByWithAggregationInput>;
export const WorkflowExecutionOrderByWithAggregationInputObjectZodSchema = makeSchema();
