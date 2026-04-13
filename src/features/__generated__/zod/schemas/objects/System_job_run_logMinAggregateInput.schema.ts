import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  processor_key: z.literal(true).optional(),
  trigger_source: z.literal(true).optional(),
  status: z.literal(true).optional(),
  processed_count: z.literal(true).optional(),
  error_count: z.literal(true).optional(),
  note: z.literal(true).optional(),
  started_at: z.literal(true).optional(),
  finished_at: z.literal(true).optional()
}).strict();
export const System_job_run_logMinAggregateInputObjectSchema: z.ZodType<Prisma.System_job_run_logMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.System_job_run_logMinAggregateInputType>;
export const System_job_run_logMinAggregateInputObjectZodSchema = makeSchema();
