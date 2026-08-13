import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentArgsObjectSchema as ShipmentArgsObjectSchema } from './ShipmentArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  shipmentId: z.boolean().optional(),
  carrierCode: z.boolean().optional(),
  externalStatus: z.boolean().optional(),
  normalizedStatus: z.boolean().optional(),
  description: z.boolean().optional(),
  location: z.boolean().optional(),
  occurredAt: z.boolean().optional(),
  payloadJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  shipment: z.union([z.boolean(), z.lazy(() => ShipmentArgsObjectSchema)]).optional()
}).strict();
export const CarrierStatusHistorySelectObjectSchema: z.ZodType<Prisma.CarrierStatusHistorySelect> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistorySelect>;
export const CarrierStatusHistorySelectObjectZodSchema = makeSchema();
