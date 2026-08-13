import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  httpStatus: z.literal(true).optional(),
  attemptCount: z.literal(true).optional()
}).strict();
export const CarrierRequestAvgAggregateInputObjectSchema: z.ZodType<Prisma.CarrierRequestAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestAvgAggregateInputType>;
export const CarrierRequestAvgAggregateInputObjectZodSchema = makeSchema();
