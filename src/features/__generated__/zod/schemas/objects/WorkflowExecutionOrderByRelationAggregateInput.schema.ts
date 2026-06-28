import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const WorkflowExecutionOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionOrderByRelationAggregateInput>;
export const WorkflowExecutionOrderByRelationAggregateInputObjectZodSchema = makeSchema();
