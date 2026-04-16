import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  key: z.literal(true).optional(),
  label: z.literal(true).optional(),
  enabled: z.literal(true).optional(),
  batch_size: z.literal(true).optional(),
  paused_reason: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  updated_by: z.literal(true).optional()
}).strict();
export const System_job_controlMinAggregateInputObjectSchema: z.ZodType<Prisma.System_job_controlMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.System_job_controlMinAggregateInputType>;
export const System_job_controlMinAggregateInputObjectZodSchema = makeSchema();
