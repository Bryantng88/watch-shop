import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentArgsObjectSchema as ShipmentArgsObjectSchema } from './ShipmentArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  shipmentId: z.boolean().optional(),
  kind: z.boolean().optional(),
  currency: z.boolean().optional(),
  estimatedAmount: z.boolean().optional(),
  chargedAmount: z.boolean().optional(),
  settlementStatus: z.boolean().optional(),
  settlementRef: z.boolean().optional(),
  settledAt: z.boolean().optional(),
  metadataJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  shipment: z.union([z.boolean(), z.lazy(() => ShipmentArgsObjectSchema)]).optional()
}).strict();
export const CarrierChargeSelectObjectSchema: z.ZodType<Prisma.CarrierChargeSelect> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeSelect>;
export const CarrierChargeSelectObjectZodSchema = makeSchema();
