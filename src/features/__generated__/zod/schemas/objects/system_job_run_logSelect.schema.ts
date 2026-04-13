import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  processor_key: z.boolean().optional(),
  trigger_source: z.boolean().optional(),
  status: z.boolean().optional(),
  processed_count: z.boolean().optional(),
  error_count: z.boolean().optional(),
  note: z.boolean().optional(),
  detail: z.boolean().optional(),
  started_at: z.boolean().optional(),
  finished_at: z.boolean().optional()
}).strict();
export const system_job_run_logSelectObjectSchema: z.ZodType<Prisma.system_job_run_logSelect> = makeSchema() as unknown as z.ZodType<Prisma.system_job_run_logSelect>;
export const system_job_run_logSelectObjectZodSchema = makeSchema();
