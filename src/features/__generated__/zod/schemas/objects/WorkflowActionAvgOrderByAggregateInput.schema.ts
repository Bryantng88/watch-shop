import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const WorkflowActionAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowActionAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionAvgOrderByAggregateInput>;
export const WorkflowActionAvgOrderByAggregateInputObjectZodSchema = makeSchema();
