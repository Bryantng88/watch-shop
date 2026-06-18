import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TaskChecklistItemAvgAggregateInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemAvgAggregateInputType>;
export const TaskChecklistItemAvgAggregateInputObjectZodSchema = makeSchema();
