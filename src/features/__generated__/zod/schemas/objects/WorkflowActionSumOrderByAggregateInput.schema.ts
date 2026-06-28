import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const WorkflowActionSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowActionSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionSumOrderByAggregateInput>;
export const WorkflowActionSumOrderByAggregateInputObjectZodSchema = makeSchema();
