import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkflowEventLogCountOrderByAggregateInputObjectSchema as WorkflowEventLogCountOrderByAggregateInputObjectSchema } from './WorkflowEventLogCountOrderByAggregateInput.schema';
import { WorkflowEventLogMaxOrderByAggregateInputObjectSchema as WorkflowEventLogMaxOrderByAggregateInputObjectSchema } from './WorkflowEventLogMaxOrderByAggregateInput.schema';
import { WorkflowEventLogMinOrderByAggregateInputObjectSchema as WorkflowEventLogMinOrderByAggregateInputObjectSchema } from './WorkflowEventLogMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WorkflowEventLogCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WorkflowEventLogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WorkflowEventLogMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WorkflowEventLogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WorkflowEventLogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowEventLogOrderByWithAggregationInput>;
export const WorkflowEventLogOrderByWithAggregationInputObjectZodSchema = makeSchema();
