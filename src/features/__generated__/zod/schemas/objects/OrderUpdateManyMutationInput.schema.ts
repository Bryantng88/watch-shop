import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { OrderStatusSchema } from '../enums/OrderStatus.schema';
import { EnumOrderStatusFieldUpdateOperationsInputObjectSchema as EnumOrderStatusFieldUpdateOperationsInputObjectSchema } from './EnumOrderStatusFieldUpdateOperationsInput.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { EnumPaymentStatusFieldUpdateOperationsInputObjectSchema as EnumPaymentStatusFieldUpdateOperationsInputObjectSchema } from './EnumPaymentStatusFieldUpdateOperationsInput.schema';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { NullableEnumPaymentMethodFieldUpdateOperationsInputObjectSchema as NullableEnumPaymentMethodFieldUpdateOperationsInputObjectSchema } from './NullableEnumPaymentMethodFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  orderCode: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  shipPhone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  shipEmail: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  shipAddress: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  shipWard: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  shipCity: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  subtotal: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  shippingFee: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  total: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([OrderStatusSchema, z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  paymentStatus: z.union([PaymentStatusSchema, z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  paymentMethod: z.union([PaymentMethodSchema, z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  customerName: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable()
}).strict();
export const OrderUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.OrderUpdateManyMutationInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateManyMutationInput>;
export const OrderUpdateManyMutationInputObjectZodSchema = makeSchema();
