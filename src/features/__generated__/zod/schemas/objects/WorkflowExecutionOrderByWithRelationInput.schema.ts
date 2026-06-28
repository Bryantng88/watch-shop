import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkflowTemplateOrderByWithRelationInputObjectSchema as WorkflowTemplateOrderByWithRelationInputObjectSchema } from './WorkflowTemplateOrderByWithRelationInput.schema';
import { WorkflowExecutionEventOrderByRelationAggregateInputObjectSchema as WorkflowExecutionEventOrderByRelationAggregateInputObjectSchema } from './WorkflowExecutionEventOrderByRelationAggregateInput.schema'

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
  workflow: z.lazy(() => WorkflowTemplateOrderByWithRelationInputObjectSchema).optional(),
  events: z.lazy(() => WorkflowExecutionEventOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionOrderByWithRelationInput>;
export const WorkflowExecutionOrderByWithRelationInputObjectZodSchema = makeSchema();
