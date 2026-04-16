import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  cost: z.literal(true).optional()
}).strict();
export const AcquisitionAvgAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionAvgAggregateInputType>;
export const AcquisitionAvgAggregateInputObjectZodSchema = makeSchema();
