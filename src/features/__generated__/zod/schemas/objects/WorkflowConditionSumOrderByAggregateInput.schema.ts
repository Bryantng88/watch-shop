import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const WorkflowConditionSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowConditionSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionSumOrderByAggregateInput>;
export const WorkflowConditionSumOrderByAggregateInputObjectZodSchema = makeSchema();
