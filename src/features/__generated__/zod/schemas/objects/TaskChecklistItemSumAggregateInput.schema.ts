import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TaskChecklistItemSumAggregateInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemSumAggregateInputType>;
export const TaskChecklistItemSumAggregateInputObjectZodSchema = makeSchema();
