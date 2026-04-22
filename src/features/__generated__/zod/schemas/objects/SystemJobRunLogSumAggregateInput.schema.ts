import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  processedCount: z.literal(true).optional(),
  errorCount: z.literal(true).optional()
}).strict();
export const SystemJobRunLogSumAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobRunLogSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobRunLogSumAggregateInputType>;
export const SystemJobRunLogSumAggregateInputObjectZodSchema = makeSchema();
