import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workflowId: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  configJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WorkflowConditionCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowConditionCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionCountOrderByAggregateInput>;
export const WorkflowConditionCountOrderByAggregateInputObjectZodSchema = makeSchema();
