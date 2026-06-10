import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const WorkCaseCategoryAvgAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryAvgAggregateInputType>;
export const WorkCaseCategoryAvgAggregateInputObjectZodSchema = makeSchema();
