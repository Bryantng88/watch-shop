import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  cost: z.literal(true).optional()
}).strict();
export const AcquisitionSumAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSumAggregateInputType>;
export const AcquisitionSumAggregateInputObjectZodSchema = makeSchema();
