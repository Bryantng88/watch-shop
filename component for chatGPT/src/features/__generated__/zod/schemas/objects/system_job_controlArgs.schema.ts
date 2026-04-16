import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { system_job_controlSelectObjectSchema as system_job_controlSelectObjectSchema } from './system_job_controlSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => system_job_controlSelectObjectSchema).optional()
}).strict();
export const system_job_controlArgsObjectSchema = makeSchema();
export const system_job_controlArgsObjectZodSchema = makeSchema();
