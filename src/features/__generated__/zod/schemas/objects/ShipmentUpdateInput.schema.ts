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
import { OrderUpdateOneRequiredWithoutShipmentsNestedInputObjectSchema as OrderUpdateOneRequiredWithoutShipmentsNestedInputObjectSchema } from './OrderUpdateOneRequiredWithoutShipmentsNestedInput.schema';
import { TaskUpdateManyWithoutShipmentNestedInputObjectSchema as TaskUpdateManyWithoutShipmentNestedInputObjectSchema } from './TaskUpdateManyWithoutShipmentNestedInput.schema';
import { WorkCaseUpdateManyWithoutShipmentNestedInputObjectSchema as WorkCaseUpdateManyWithoutShipmentNestedInputObjectSchema } from './WorkCaseUpdateManyWithoutShipmentNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
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
  refNo: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  orderRefNo: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  customerName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutShipmentsNestedInputObjectSchema).optional(),
  task: z.lazy(() => TaskUpdateManyWithoutShipmentNestedInputObjectSchema).optional(),
  workCase: z.lazy(() => WorkCaseUpdateManyWithoutShipmentNestedInputObjectSchema).optional()
}).strict();
export const ShipmentUpdateInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateInput>;
export const ShipmentUpdateInputObjectZodSchema = makeSchema();
