import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const WorkflowConditionAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowConditionAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionAvgOrderByAggregateInput>;
export const WorkflowConditionAvgOrderByAggregateInputObjectZodSchema = makeSchema();
