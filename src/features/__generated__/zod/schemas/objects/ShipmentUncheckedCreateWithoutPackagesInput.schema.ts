import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentStatusSchema } from '../enums/ShipmentStatus.schema';
import { ShippingFeePayerSchema } from '../enums/ShippingFeePayer.schema';
import { TaskUncheckedCreateNestedManyWithoutShipmentInputObjectSchema as TaskUncheckedCreateNestedManyWithoutShipmentInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutShipmentInput.schema';
import { WorkCaseUncheckedCreateNestedManyWithoutShipmentInputObjectSchema as WorkCaseUncheckedCreateNestedManyWithoutShipmentInputObjectSchema } from './WorkCaseUncheckedCreateNestedManyWithoutShipmentInput.schema';
import { CarrierRequestUncheckedCreateNestedManyWithoutShipmentInputObjectSchema as CarrierRequestUncheckedCreateNestedManyWithoutShipmentInputObjectSchema } from './CarrierRequestUncheckedCreateNestedManyWithoutShipmentInput.schema';
import { CarrierStatusHistoryUncheckedCreateNestedManyWithoutShipmentInputObjectSchema as CarrierStatusHistoryUncheckedCreateNestedManyWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUncheckedCreateNestedManyWithoutShipmentInput.schema';
import { CarrierChargeUncheckedCreateNestedManyWithoutShipmentInputObjectSchema as CarrierChargeUncheckedCreateNestedManyWithoutShipmentInputObjectSchema } from './CarrierChargeUncheckedCreateNestedManyWithoutShipmentInput.schema'

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
  carrierCode: z.string().optional().nullable(),
  carrierEnvironment: z.string().optional().nullable(),
  externalOrderCode: z.string().optional().nullable(),
  carrierStatus: z.string().optional().nullable(),
  carrierStatusText: z.string().optional().nullable(),
  carrierSyncedAt: z.coerce.date().optional().nullable(),
  carrierCreatedAt: z.coerce.date().optional().nullable(),
  estimatedDeliveryAt: z.coerce.date().optional().nullable(),
  refNo: z.string().optional().nullable(),
  orderRefNo: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  task: z.lazy(() => TaskUncheckedCreateNestedManyWithoutShipmentInputObjectSchema).optional(),
  workCase: z.lazy(() => WorkCaseUncheckedCreateNestedManyWithoutShipmentInputObjectSchema).optional(),
  carrierRequests: z.lazy(() => CarrierRequestUncheckedCreateNestedManyWithoutShipmentInputObjectSchema).optional(),
  carrierStatusHistory: z.lazy(() => CarrierStatusHistoryUncheckedCreateNestedManyWithoutShipmentInputObjectSchema).optional(),
  carrierCharges: z.lazy(() => CarrierChargeUncheckedCreateNestedManyWithoutShipmentInputObjectSchema).optional()
}).strict();
export const ShipmentUncheckedCreateWithoutPackagesInputObjectSchema: z.ZodType<Prisma.ShipmentUncheckedCreateWithoutPackagesInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUncheckedCreateWithoutPackagesInput>;
export const ShipmentUncheckedCreateWithoutPackagesInputObjectZodSchema = makeSchema();
