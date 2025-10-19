import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AcquisitionItemUpdateManyWithoutSourceOrderItemNestedInputObjectSchema as AcquisitionItemUpdateManyWithoutSourceOrderItemNestedInputObjectSchema } from './AcquisitionItemUpdateManyWithoutSourceOrderItemNestedInput.schema';
import { OrderUpdateOneRequiredWithoutItemsNestedInputObjectSchema as OrderUpdateOneRequiredWithoutItemsNestedInputObjectSchema } from './OrderUpdateOneRequiredWithoutItemsNestedInput.schema';
import { ServiceRequestUpdateManyWithoutOrderItemNestedInputObjectSchema as ServiceRequestUpdateManyWithoutOrderItemNestedInputObjectSchema } from './ServiceRequestUpdateManyWithoutOrderItemNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  price: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  subtotal: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  img: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemUpdateManyWithoutSourceOrderItemNestedInputObjectSchema).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutItemsNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUpdateManyWithoutOrderItemNestedInputObjectSchema).optional()
}).strict();
export const OrderItemUpdateWithoutProductInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateWithoutProductInput>;
export const OrderItemUpdateWithoutProductInputObjectZodSchema = makeSchema();
