import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workflowId: SortOrderSchema.optional(),
  actionType: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  configJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WorkflowActionCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowActionCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionCountOrderByAggregateInput>;
export const WorkflowActionCountOrderByAggregateInputObjectZodSchema = makeSchema();
