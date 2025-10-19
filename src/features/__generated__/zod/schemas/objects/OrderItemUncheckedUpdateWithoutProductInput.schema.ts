import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemNestedInputObjectSchema as AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemNestedInputObjectSchema } from './AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemNestedInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  orderId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  price: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  subtotal: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  img: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema).optional()
}).strict();
export const OrderItemUncheckedUpdateWithoutProductInputObjectSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutProductInput>;
export const OrderItemUncheckedUpdateWithoutProductInputObjectZodSchema = makeSchema();
