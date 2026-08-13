import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  shipPhone: z.literal(true).optional(),
  shipAddress: z.literal(true).optional(),
  shipCity: z.literal(true).optional(),
  shipDistrict: z.literal(true).optional(),
  shipWard: z.literal(true).optional(),
  carrier: z.literal(true).optional(),
  trackingCode: z.literal(true).optional(),
  shippingAmount: z.literal(true).optional(),
  currency: z.literal(true).optional(),
  shippedAt: z.literal(true).optional(),
  deliveredAt: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  status: z.literal(true).optional(),
  shippingFeePayer: z.literal(true).optional(),
  carrierCode: z.literal(true).optional(),
  carrierEnvironment: z.literal(true).optional(),
  externalOrderCode: z.literal(true).optional(),
  carrierStatus: z.literal(true).optional(),
  carrierStatusText: z.literal(true).optional(),
  carrierSyncedAt: z.literal(true).optional(),
  carrierCreatedAt: z.literal(true).optional(),
  estimatedDeliveryAt: z.literal(true).optional(),
  refNo: z.literal(true).optional(),
  orderRefNo: z.literal(true).optional(),
  customerName: z.literal(true).optional()
}).strict();
export const ShipmentMaxAggregateInputObjectSchema: z.ZodType<Prisma.ShipmentMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentMaxAggregateInputType>;
export const ShipmentMaxAggregateInputObjectZodSchema = makeSchema();
