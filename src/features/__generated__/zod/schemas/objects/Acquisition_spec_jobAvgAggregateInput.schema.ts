import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  attempts: z.literal(true).optional(),
  priority: z.literal(true).optional()
}).strict();
export const Acquisition_spec_jobAvgAggregateInputObjectSchema: z.ZodType<Prisma.Acquisition_spec_jobAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.Acquisition_spec_jobAvgAggregateInputType>;
export const Acquisition_spec_jobAvgAggregateInputObjectZodSchema = makeSchema();
