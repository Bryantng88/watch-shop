import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentStatusSchema } from '../enums/ShipmentStatus.schema';
import { ShippingFeePayerSchema } from '../enums/ShippingFeePayer.schema';
import { WorkCaseUncheckedCreateNestedManyWithoutShipmentInputObjectSchema as WorkCaseUncheckedCreateNestedManyWithoutShipmentInputObjectSchema } from './WorkCaseUncheckedCreateNestedManyWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string(),
  shipPhone: z.string().optional().nullable(),
  shipAddress: z.string().optional().nullable(),
  shipCity: z.string().optional().nullable(),
  shipDistrict: z.string().optional().nullable(),
  shipWard: z.string().optional().nullable(),
  carrier: z.string().optional().nullable(),
  trackingCode: z.string().optional().nullable(),
  shippingAmount: z.number().optional(),
  currency: z.string().optional(),
  shippedAt: z.coerce.date().optional().nullable(),
  deliveredAt: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: ShipmentStatusSchema.optional(),
  shippingFeePayer: ShippingFeePayerSchema.optional().nullable(),
  refNo: z.string().optional().nullable(),
  orderRefNo: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  workCase: z.lazy(() => WorkCaseUncheckedCreateNestedManyWithoutShipmentInputObjectSchema).optional()
}).strict();
export const ShipmentUncheckedCreateWithoutTaskInputObjectSchema: z.ZodType<Prisma.ShipmentUncheckedCreateWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUncheckedCreateWithoutTaskInput>;
export const ShipmentUncheckedCreateWithoutTaskInputObjectZodSchema = makeSchema();
