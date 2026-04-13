import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  attempts: z.literal(true).optional(),
  priority: z.literal(true).optional()
}).strict();
export const Acquisition_spec_jobSumAggregateInputObjectSchema: z.ZodType<Prisma.Acquisition_spec_jobSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.Acquisition_spec_jobSumAggregateInputType>;
export const Acquisition_spec_jobSumAggregateInputObjectZodSchema = makeSchema();
