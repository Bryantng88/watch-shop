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
export const WorkflowActionMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowActionMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionMinOrderByAggregateInput>;
export const WorkflowActionMinOrderByAggregateInputObjectZodSchema = makeSchema();
