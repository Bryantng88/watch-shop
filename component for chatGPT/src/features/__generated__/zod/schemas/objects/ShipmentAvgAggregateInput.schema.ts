import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  shippingFee: z.literal(true).optional()
}).strict();
export const ShipmentAvgAggregateInputObjectSchema: z.ZodType<Prisma.ShipmentAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentAvgAggregateInputType>;
export const ShipmentAvgAggregateInputObjectZodSchema = makeSchema();
