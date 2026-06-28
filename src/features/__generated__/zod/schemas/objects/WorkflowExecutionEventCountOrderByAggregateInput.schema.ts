import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  executionId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  eventLogId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const WorkflowExecutionEventCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCountOrderByAggregateInput>;
export const WorkflowExecutionEventCountOrderByAggregateInputObjectZodSchema = makeSchema();
