import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workflowId: SortOrderSchema.optional(),
  actionTargetType: SortOrderSchema.optional(),
  actionTargetId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  errorMessage: SortOrderSchema.optional(),
  startedAt: SortOrderSchema.optional(),
  completedAt: SortOrderSchema.optional(),
  failedAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WorkflowExecutionMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionMaxOrderByAggregateInput>;
export const WorkflowExecutionMaxOrderByAggregateInputObjectZodSchema = makeSchema();
