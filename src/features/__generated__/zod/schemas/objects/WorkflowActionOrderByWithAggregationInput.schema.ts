import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkflowActionCountOrderByAggregateInputObjectSchema as WorkflowActionCountOrderByAggregateInputObjectSchema } from './WorkflowActionCountOrderByAggregateInput.schema';
import { WorkflowActionAvgOrderByAggregateInputObjectSchema as WorkflowActionAvgOrderByAggregateInputObjectSchema } from './WorkflowActionAvgOrderByAggregateInput.schema';
import { WorkflowActionMaxOrderByAggregateInputObjectSchema as WorkflowActionMaxOrderByAggregateInputObjectSchema } from './WorkflowActionMaxOrderByAggregateInput.schema';
import { WorkflowActionMinOrderByAggregateInputObjectSchema as WorkflowActionMinOrderByAggregateInputObjectSchema } from './WorkflowActionMinOrderByAggregateInput.schema';
import { WorkflowActionSumOrderByAggregateInputObjectSchema as WorkflowActionSumOrderByAggregateInputObjectSchema } from './WorkflowActionSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workflowId: SortOrderSchema.optional(),
  actionType: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  configJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WorkflowActionCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => WorkflowActionAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WorkflowActionMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WorkflowActionMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => WorkflowActionSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WorkflowActionOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WorkflowActionOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionOrderByWithAggregationInput>;
export const WorkflowActionOrderByWithAggregationInputObjectZodSchema = makeSchema();
