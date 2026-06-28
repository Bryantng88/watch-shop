import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workflowId: SortOrderSchema.optional(),
  actionType: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WorkflowActionMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowActionMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionMaxOrderByAggregateInput>;
export const WorkflowActionMaxOrderByAggregateInputObjectZodSchema = makeSchema();
