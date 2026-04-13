import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { system_job_run_logSelectObjectSchema as system_job_run_logSelectObjectSchema } from './system_job_run_logSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => system_job_run_logSelectObjectSchema).optional()
}).strict();
export const system_job_run_logArgsObjectSchema = makeSchema();
export const system_job_run_logArgsObjectZodSchema = makeSchema();
