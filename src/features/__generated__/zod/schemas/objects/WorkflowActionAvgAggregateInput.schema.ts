import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const WorkflowActionAvgAggregateInputObjectSchema: z.ZodType<Prisma.WorkflowActionAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionAvgAggregateInputType>;
export const WorkflowActionAvgAggregateInputObjectZodSchema = makeSchema();
