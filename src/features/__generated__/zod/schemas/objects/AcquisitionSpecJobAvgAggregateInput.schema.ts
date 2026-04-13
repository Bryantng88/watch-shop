import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  attempts: z.literal(true).optional(),
  priority: z.literal(true).optional()
}).strict();
export const AcquisitionSpecJobAvgAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobAvgAggregateInputType>;
export const AcquisitionSpecJobAvgAggregateInputObjectZodSchema = makeSchema();
