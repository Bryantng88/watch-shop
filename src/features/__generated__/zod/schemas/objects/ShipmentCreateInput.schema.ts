import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentStatusSchema } from '../enums/ShipmentStatus.schema';
import { ShippingFeePayerSchema } from '../enums/ShippingFeePayer.schema';
import { OrderCreateNestedOneWithoutShipmentsInputObjectSchema as OrderCreateNestedOneWithoutShipmentsInputObjectSchema } from './OrderCreateNestedOneWithoutShipmentsInput.schema';
import { TaskCreateNestedManyWithoutShipmentInputObjectSchema as TaskCreateNestedManyWithoutShipmentInputObjectSchema } from './TaskCreateNestedManyWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  shipPhone: z.string().optional().nullable(),
  shipAddress: z.string().optional().nullable(),
  shipCity: z.string().optional().nullable(),
  shipDistrict: z.string().optional().nullable(),
  shipWard: z.string().optional().nullable(),
  carrier: z.string().optional().nullable(),
  trackingCode: z.string().optional().nullable(),
  shippingAmount: z.number().optional(),
  currency: z.string().max(10).optional(),
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
  order: z.lazy(() => OrderCreateNestedOneWithoutShipmentsInputObjectSchema),
  Task: z.lazy(() => TaskCreateNestedManyWithoutShipmentInputObjectSchema)
}).strict();
export const ShipmentCreateInputObjectSchema: z.ZodType<Prisma.ShipmentCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateInput>;
export const ShipmentCreateInputObjectZodSchema = makeSchema();
