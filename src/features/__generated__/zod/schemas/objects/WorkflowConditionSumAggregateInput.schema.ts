import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const WorkflowConditionSumAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowConditionSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionSumAggregateInputType>;
export const WorkflowConditionSumAggregateInputObjectZodSchema = makeSchema();
