import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { EnumPaymentMethodFieldUpdateOperationsInputObjectSchema as EnumPaymentMethodFieldUpdateOperationsInputObjectSchema } from './EnumPaymentMethodFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { paymentdirectionSchema } from '../enums/paymentdirection.schema';
import { NullableEnumpaymentdirectionFieldUpdateOperationsInputObjectSchema as NullableEnumpaymentdirectionFieldUpdateOperationsInputObjectSchema } from './NullableEnumpaymentdirectionFieldUpdateOperationsInput.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { EnumPaymentStatusFieldUpdateOperationsInputObjectSchema as EnumPaymentStatusFieldUpdateOperationsInputObjectSchema } from './EnumPaymentStatusFieldUpdateOperationsInput.schema';
import { PaymentPurposeSchema } from '../enums/PaymentPurpose.schema';
import { EnumPaymentPurposeFieldUpdateOperationsInputObjectSchema as EnumPaymentPurposeFieldUpdateOperationsInputObjectSchema } from './EnumPaymentPurposeFieldUpdateOperationsInput.schema';
import { PaymentTypeSchema } from '../enums/PaymentType.schema';
import { EnumPaymentTypeFieldUpdateOperationsInputObjectSchema as EnumPaymentTypeFieldUpdateOperationsInputObjectSchema } from './EnumPaymentTypeFieldUpdateOperationsInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutPaymentNestedInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutPaymentNestedInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutPaymentNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  method: z.union([PaymentMethodSchema, z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputObjectSchema)]).optional(),
  amount: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  currency: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  paidAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  reference: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  direction: z.union([paymentdirectionSchema, z.lazy(() => NullableEnumpaymentdirectionFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  order_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  service_request_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  vendor_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  acquisition_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  status: z.union([PaymentStatusSchema, z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  purpose: z.union([PaymentPurposeSchema, z.lazy(() => EnumPaymentPurposeFieldUpdateOperationsInputObjectSchema)]).optional(),
  shipment_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  type: z.union([PaymentTypeSchema, z.lazy(() => EnumPaymentTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutPaymentNestedInputObjectSchema).optional()
}).strict();
export const PaymentUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.PaymentUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUncheckedUpdateInput>;
export const PaymentUncheckedUpdateInputObjectZodSchema = makeSchema();
