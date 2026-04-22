import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  processedCount: z.literal(true).optional(),
  errorCount: z.literal(true).optional()
}).strict();
export const SystemJobRunLogAvgAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobRunLogAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobRunLogAvgAggregateInputType>;
export const SystemJobRunLogAvgAggregateInputObjectZodSchema = makeSchema();
