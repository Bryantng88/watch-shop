import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkflowExecutionEventOrderByRelationAggregateInputObjectSchema as WorkflowExecutionEventOrderByRelationAggregateInputObjectSchema } from './WorkflowExecutionEventOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  workflowEvents: z.lazy(() => WorkflowExecutionEventOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const BusinessEventLogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.BusinessEventLogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogOrderByWithRelationInput>;
export const BusinessEventLogOrderByWithRelationInputObjectZodSchema = makeSchema();
