import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  estimatedAmount: z.literal(true).optional(),
  chargedAmount: z.literal(true).optional()
}).strict();
export const CarrierChargeAvgAggregateInputObjectSchema: z.ZodType<Prisma.CarrierChargeAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeAvgAggregateInputType>;
export const CarrierChargeAvgAggregateInputObjectZodSchema = makeSchema();
