import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  shipmentId: z.literal(true).optional(),
  carrierCode: z.literal(true).optional(),
  externalStatus: z.literal(true).optional(),
  normalizedStatus: z.literal(true).optional(),
  description: z.literal(true).optional(),
  location: z.literal(true).optional(),
  occurredAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const CarrierStatusHistoryMaxAggregateInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryMaxAggregateInputType>;
export const CarrierStatusHistoryMaxAggregateInputObjectZodSchema = makeSchema();
