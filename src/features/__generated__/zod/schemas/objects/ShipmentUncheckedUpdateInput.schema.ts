import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ShipmentStatusSchema } from '../enums/ShipmentStatus.schema';
import { EnumShipmentStatusFieldUpdateOperationsInputObjectSchema as EnumShipmentStatusFieldUpdateOperationsInputObjectSchema } from './EnumShipmentStatusFieldUpdateOperationsInput.schema';
import { ShippingFeePayerSchema } from '../enums/ShippingFeePayer.schema';
import { NullableEnumShippingFeePayerFieldUpdateOperationsInputObjectSchema as NullableEnumShippingFeePayerFieldUpdateOperationsInputObjectSchema } from './NullableEnumShippingFeePayerFieldUpdateOperationsInput.schema';
import { TaskUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema as TaskUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema } from './TaskUncheckedUpdateManyWithoutShipmentNestedInput.schema';
import { WorkCaseUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema as WorkCaseUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema } from './WorkCaseUncheckedUpdateManyWithoutShipmentNestedInput.schema';
import { ShipmentPackageUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema as ShipmentPackageUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema } from './ShipmentPackageUncheckedUpdateManyWithoutShipmentNestedInput.schema';
import { CarrierRequestUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema as CarrierRequestUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema } from './CarrierRequestUncheckedUpdateManyWithoutShipmentNestedInput.schema';
import { CarrierStatusHistoryUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema as CarrierStatusHistoryUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema } from './CarrierStatusHistoryUncheckedUpdateManyWithoutShipmentNestedInput.schema';
import { CarrierChargeUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema as CarrierChargeUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema } from './CarrierChargeUncheckedUpdateManyWithoutShipmentNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  orderId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  shipPhone: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  shipAddress: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  shipCity: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  shipDistrict: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  shipWard: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  carrier: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  trackingCode: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  shippingAmount: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  currency: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  shippedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  deliveredAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([ShipmentStatusSchema, z.lazy(() => EnumShipmentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  shippingFeePayer: z.union([ShippingFeePayerSchema, z.lazy(() => NullableEnumShippingFeePayerFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  carrierCode: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  carrierEnvironment: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  externalOrderCode: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  carrierStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  carrierStatusText: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  carrierSyncedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  carrierCreatedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  estimatedDeliveryAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  refNo: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  orderRefNo: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  customerName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  task: z.lazy(() => TaskUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema).optional(),
  workCase: z.lazy(() => WorkCaseUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema).optional(),
  packages: z.lazy(() => ShipmentPackageUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema).optional(),
  carrierRequests: z.lazy(() => CarrierRequestUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema).optional(),
  carrierStatusHistory: z.lazy(() => CarrierStatusHistoryUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema).optional(),
  carrierCharges: z.lazy(() => CarrierChargeUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema).optional()
}).strict();
export const ShipmentUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.ShipmentUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUncheckedUpdateInput>;
export const ShipmentUncheckedUpdateInputObjectZodSchema = makeSchema();
