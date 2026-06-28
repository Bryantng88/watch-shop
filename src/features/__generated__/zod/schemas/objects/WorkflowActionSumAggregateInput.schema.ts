import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const WorkflowActionSumAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowActionSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionSumAggregateInputType>;
export const WorkflowActionSumAggregateInputObjectZodSchema = makeSchema();
