import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  shipmentId: z.literal(true).optional(),
  carrierCode: z.literal(true).optional(),
  environment: z.literal(true).optional(),
  operation: z.literal(true).optional(),
  idempotencyKey: z.literal(true).optional(),
  status: z.literal(true).optional(),
  httpStatus: z.literal(true).optional(),
  externalOrderCode: z.literal(true).optional(),
  errorCode: z.literal(true).optional(),
  errorMessage: z.literal(true).optional(),
  attemptCount: z.literal(true).optional(),
  requestedAt: z.literal(true).optional(),
  completedAt: z.literal(true).optional()
}).strict();
export const CarrierRequestMaxAggregateInputObjectSchema: z.ZodType<Prisma.CarrierRequestMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestMaxAggregateInputType>;
export const CarrierRequestMaxAggregateInputObjectZodSchema = makeSchema();
