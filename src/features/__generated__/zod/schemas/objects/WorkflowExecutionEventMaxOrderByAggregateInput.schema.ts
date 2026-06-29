import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  executionId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  businessEventLogId: SortOrderSchema.optional()
}).strict();
export const WorkflowExecutionEventMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventMaxOrderByAggregateInput>;
export const WorkflowExecutionEventMaxOrderByAggregateInputObjectZodSchema = makeSchema();
