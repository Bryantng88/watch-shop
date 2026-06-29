import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkflowExecutionEventCountOrderByAggregateInputObjectSchema as WorkflowExecutionEventCountOrderByAggregateInputObjectSchema } from './WorkflowExecutionEventCountOrderByAggregateInput.schema';
import { WorkflowExecutionEventMaxOrderByAggregateInputObjectSchema as WorkflowExecutionEventMaxOrderByAggregateInputObjectSchema } from './WorkflowExecutionEventMaxOrderByAggregateInput.schema';
import { WorkflowExecutionEventMinOrderByAggregateInputObjectSchema as WorkflowExecutionEventMinOrderByAggregateInputObjectSchema } from './WorkflowExecutionEventMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  executionId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  businessEventLogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => WorkflowExecutionEventCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WorkflowExecutionEventMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WorkflowExecutionEventMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionEventOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventOrderByWithAggregationInput>;
export const WorkflowExecutionEventOrderByWithAggregationInputObjectZodSchema = makeSchema();
