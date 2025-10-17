import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  depositAmt: z.literal(true).optional()
}).strict();
export const ReservationAvgAggregateInputObjectSchema: z.ZodType<Prisma.ReservationAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ReservationAvgAggregateInputType>;
export const ReservationAvgAggregateInputObjectZodSchema = makeSchema();
