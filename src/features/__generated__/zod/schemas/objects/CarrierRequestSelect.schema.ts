import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentArgsObjectSchema as ShipmentArgsObjectSchema } from './ShipmentArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  shipmentId: z.boolean().optional(),
  carrierCode: z.boolean().optional(),
  environment: z.boolean().optional(),
  operation: z.boolean().optional(),
  idempotencyKey: z.boolean().optional(),
  requestJson: z.boolean().optional(),
  responseJson: z.boolean().optional(),
  status: z.boolean().optional(),
  httpStatus: z.boolean().optional(),
  externalOrderCode: z.boolean().optional(),
  errorCode: z.boolean().optional(),
  errorMessage: z.boolean().optional(),
  attemptCount: z.boolean().optional(),
  requestedAt: z.boolean().optional(),
  completedAt: z.boolean().optional(),
  shipment: z.union([z.boolean(), z.lazy(() => ShipmentArgsObjectSchema)]).optional()
}).strict();
export const CarrierRequestSelectObjectSchema: z.ZodType<Prisma.CarrierRequestSelect> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestSelect>;
export const CarrierRequestSelectObjectZodSchema = makeSchema();
