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
export const WorkflowExecutionEventMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventMinOrderByAggregateInput>;
export const WorkflowExecutionEventMinOrderByAggregateInputObjectZodSchema = makeSchema();
