import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workflowId: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WorkflowConditionMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowConditionMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionMaxOrderByAggregateInput>;
export const WorkflowConditionMaxOrderByAggregateInputObjectZodSchema = makeSchema();
