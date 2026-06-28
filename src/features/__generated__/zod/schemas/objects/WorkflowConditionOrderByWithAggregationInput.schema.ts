import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkflowConditionCountOrderByAggregateInputObjectSchema as WorkflowConditionCountOrderByAggregateInputObjectSchema } from './WorkflowConditionCountOrderByAggregateInput.schema';
import { WorkflowConditionAvgOrderByAggregateInputObjectSchema as WorkflowConditionAvgOrderByAggregateInputObjectSchema } from './WorkflowConditionAvgOrderByAggregateInput.schema';
import { WorkflowConditionMaxOrderByAggregateInputObjectSchema as WorkflowConditionMaxOrderByAggregateInputObjectSchema } from './WorkflowConditionMaxOrderByAggregateInput.schema';
import { WorkflowConditionMinOrderByAggregateInputObjectSchema as WorkflowConditionMinOrderByAggregateInputObjectSchema } from './WorkflowConditionMinOrderByAggregateInput.schema';
import { WorkflowConditionSumOrderByAggregateInputObjectSchema as WorkflowConditionSumOrderByAggregateInputObjectSchema } from './WorkflowConditionSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workflowId: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  configJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WorkflowConditionCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => WorkflowConditionAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WorkflowConditionMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WorkflowConditionMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => WorkflowConditionSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WorkflowConditionOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WorkflowConditionOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionOrderByWithAggregationInput>;
export const WorkflowConditionOrderByWithAggregationInputObjectZodSchema = makeSchema();
