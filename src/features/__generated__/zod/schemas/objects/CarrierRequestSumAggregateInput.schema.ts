import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  httpStatus: z.literal(true).optional(),
  attemptCount: z.literal(true).optional()
}).strict();
export const CarrierRequestSumAggregateInputObjectSchema: z.ZodType<Prisma.CarrierRequestSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestSumAggregateInputType>;
export const CarrierRequestSumAggregateInputObjectZodSchema = makeSchema();
