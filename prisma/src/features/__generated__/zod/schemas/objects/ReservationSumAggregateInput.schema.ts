import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  depositAmt: z.literal(true).optional()
}).strict();
export const ReservationSumAggregateInputObjectSchema: z.ZodType<Prisma.ReservationSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ReservationSumAggregateInputType>;
export const ReservationSumAggregateInputObjectZodSchema = makeSchema();
