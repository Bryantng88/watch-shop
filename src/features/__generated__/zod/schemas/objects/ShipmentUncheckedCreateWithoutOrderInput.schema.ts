import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { shipmentstatusSchema } from '../enums/shipmentstatus.schema'

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
  currency: z.string().optional(),
  shippedAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: shipmentstatusSchema.optional(),
  refNo: z.string().optional().nullable(),
  orderRefNo: z.string().optional().nullable()
}).strict();
export const ShipmentUncheckedCreateWithoutOrderInputObjectSchema: z.ZodType<Prisma.ShipmentUncheckedCreateWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUncheckedCreateWithoutOrderInput>;
export const ShipmentUncheckedCreateWithoutOrderInputObjectZodSchema = makeSchema();
