import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  shippingFee: z.literal(true).optional()
}).strict();
export const ShipmentSumAggregateInputObjectSchema: z.ZodType<Prisma.ShipmentSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentSumAggregateInputType>;
export const ShipmentSumAggregateInputObjectZodSchema = makeSchema();
