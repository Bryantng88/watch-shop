import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { shipmentstatusSchema } from '../enums/shipmentstatus.schema';
import { OrderCreateNestedOneWithoutShipmentInputObjectSchema as OrderCreateNestedOneWithoutShipmentInputObjectSchema } from './OrderCreateNestedOneWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  shipPhone: z.string().optional().nullable(),
  shipAddress: z.string().optional().nullable(),
  shipCity: z.string().optional().nullable(),
  shipDistrict: z.string().optional().nullable(),
  shipWard: z.string().optional().nullable(),
  carrier: z.string().optional().nullable(),
  trackingCode: z.string().optional().nullable(),
  shippingFee: z.number().optional(),
  currency: z.string().max(10).optional(),
  shippedAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: shipmentstatusSchema.optional(),
  Order: z.lazy(() => OrderCreateNestedOneWithoutShipmentInputObjectSchema)
}).strict();
export const ShipmentCreateInputObjectSchema: z.ZodType<Prisma.ShipmentCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateInput>;
export const ShipmentCreateInputObjectZodSchema = makeSchema();
