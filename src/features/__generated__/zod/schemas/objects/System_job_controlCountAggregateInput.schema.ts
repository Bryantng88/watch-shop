import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  key: z.literal(true).optional(),
  label: z.literal(true).optional(),
  enabled: z.literal(true).optional(),
  batch_size: z.literal(true).optional(),
  paused_reason: z.literal(true).optional(),
  metadata: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  updated_by: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const System_job_controlCountAggregateInputObjectSchema: z.ZodType<Prisma.System_job_controlCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.System_job_controlCountAggregateInputType>;
export const System_job_controlCountAggregateInputObjectZodSchema = makeSchema();
