import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  batch_size: z.literal(true).optional()
}).strict();
export const System_job_controlAvgAggregateInputObjectSchema: z.ZodType<Prisma.System_job_controlAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.System_job_controlAvgAggregateInputType>;
export const System_job_controlAvgAggregateInputObjectZodSchema = makeSchema();
