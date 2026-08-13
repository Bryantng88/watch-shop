import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  estimatedAmount: z.literal(true).optional(),
  chargedAmount: z.literal(true).optional()
}).strict();
export const CarrierChargeSumAggregateInputObjectSchema: z.ZodType<Prisma.CarrierChargeSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeSumAggregateInputType>;
export const CarrierChargeSumAggregateInputObjectZodSchema = makeSchema();
