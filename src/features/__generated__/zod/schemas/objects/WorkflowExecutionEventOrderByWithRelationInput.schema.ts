import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkflowExecutionOrderByWithRelationInputObjectSchema as WorkflowExecutionOrderByWithRelationInputObjectSchema } from './WorkflowExecutionOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  executionId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  eventLogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  execution: z.lazy(() => WorkflowExecutionOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionEventOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventOrderByWithRelationInput>;
export const WorkflowExecutionEventOrderByWithRelationInputObjectZodSchema = makeSchema();
