import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const WorkCaseCategorySumAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseCategorySumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategorySumAggregateInputType>;
export const WorkCaseCategorySumAggregateInputObjectZodSchema = makeSchema();
