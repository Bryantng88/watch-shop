import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkflowConditionOrderByRelationAggregateInputObjectSchema as WorkflowConditionOrderByRelationAggregateInputObjectSchema } from './WorkflowConditionOrderByRelationAggregateInput.schema';
import { WorkflowActionOrderByRelationAggregateInputObjectSchema as WorkflowActionOrderByRelationAggregateInputObjectSchema } from './WorkflowActionOrderByRelationAggregateInput.schema';
import { WorkflowExecutionOrderByRelationAggregateInputObjectSchema as WorkflowExecutionOrderByRelationAggregateInputObjectSchema } from './WorkflowExecutionOrderByRelationAggregateInput.schema';
import { AppTagOrderByRelationAggregateInputObjectSchema as AppTagOrderByRelationAggregateInputObjectSchema } from './AppTagOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  strategy: SortOrderSchema.optional(),
  ownerType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  ownerId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isSystem: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  conditions: z.lazy(() => WorkflowConditionOrderByRelationAggregateInputObjectSchema).optional(),
  actions: z.lazy(() => WorkflowActionOrderByRelationAggregateInputObjectSchema).optional(),
  executions: z.lazy(() => WorkflowExecutionOrderByRelationAggregateInputObjectSchema).optional(),
  tags: z.lazy(() => AppTagOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateOrderByWithRelationInput>;
export const WorkflowTemplateOrderByWithRelationInputObjectZodSchema = makeSchema();
