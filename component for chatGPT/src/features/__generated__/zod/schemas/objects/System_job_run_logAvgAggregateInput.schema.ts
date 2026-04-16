import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  processed_count: z.literal(true).optional(),
  error_count: z.literal(true).optional()
}).strict();
export const System_job_run_logAvgAggregateInputObjectSchema: z.ZodType<Prisma.System_job_run_logAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.System_job_run_logAvgAggregateInputType>;
export const System_job_run_logAvgAggregateInputObjectZodSchema = makeSchema();
