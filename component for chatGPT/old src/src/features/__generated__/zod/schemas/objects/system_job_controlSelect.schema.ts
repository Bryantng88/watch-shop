import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  key: z.boolean().optional(),
  label: z.boolean().optional(),
  enabled: z.boolean().optional(),
  batch_size: z.boolean().optional(),
  paused_reason: z.boolean().optional(),
  metadata: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  updated_by: z.boolean().optional()
}).strict();
export const system_job_controlSelectObjectSchema: z.ZodType<Prisma.system_job_controlSelect> = makeSchema() as unknown as z.ZodType<Prisma.system_job_controlSelect>;
export const system_job_controlSelectObjectZodSchema = makeSchema();
