import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  batch_size: z.literal(true).optional()
}).strict();
export const System_job_controlSumAggregateInputObjectSchema: z.ZodType<Prisma.System_job_controlSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.System_job_controlSumAggregateInputType>;
export const System_job_controlSumAggregateInputObjectZodSchema = makeSchema();
