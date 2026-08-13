import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  shipmentId: z.literal(true).optional(),
  kind: z.literal(true).optional(),
  currency: z.literal(true).optional(),
  estimatedAmount: z.literal(true).optional(),
  chargedAmount: z.literal(true).optional(),
  settlementStatus: z.literal(true).optional(),
  settlementRef: z.literal(true).optional(),
  settledAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const CarrierChargeMinAggregateInputObjectSchema: z.ZodType<Prisma.CarrierChargeMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeMinAggregateInputType>;
export const CarrierChargeMinAggregateInputObjectZodSchema = makeSchema();
