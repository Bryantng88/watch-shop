import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TaskTypeSumAggregateInputObjectSchema: z.ZodType<Prisma.TaskTypeSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeSumAggregateInputType>;
export const TaskTypeSumAggregateInputObjectZodSchema = makeSchema();
