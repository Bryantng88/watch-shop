import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { DiscountTypeSchema } from '../enums/DiscountType.schema';
import { NullableEnumDiscountTypeFieldUpdateOperationsInputObjectSchema as NullableEnumDiscountTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumDiscountTypeFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { NullableEnumProductTypeFieldUpdateOperationsInputObjectSchema as NullableEnumProductTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumProductTypeFieldUpdateOperationsInput.schema';
import { OrderItemKindSchema } from '../enums/OrderItemKind.schema';
import { EnumOrderItemKindFieldUpdateOperationsInputObjectSchema as EnumOrderItemKindFieldUpdateOperationsInputObjectSchema } from './EnumOrderItemKindFieldUpdateOperationsInput.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { NullableEnumServiceScopeFieldUpdateOperationsInputObjectSchema as NullableEnumServiceScopeFieldUpdateOperationsInputObjectSchema } from './NullableEnumServiceScopeFieldUpdateOperationsInput.schema';
import { OrderFlowTypeSchema } from '../enums/OrderFlowType.schema';
import { EnumOrderFlowTypeFieldUpdateOperationsInputObjectSchema as EnumOrderFlowTypeFieldUpdateOperationsInputObjectSchema } from './EnumOrderFlowTypeFieldUpdateOperationsInput.schema';
import { AcquisitionItemUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema as AcquisitionItemUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema } from './AcquisitionItemUncheckedUpdateManyWithoutOrderItemNestedInput.schema';
import { OrderItemUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema as OrderItemUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema } from './OrderItemUncheckedUpdateManyWithoutOrderItemNestedInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  orderId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  variantId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  listPrice: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  discountType: z.union([DiscountTypeSchema, z.lazy(() => NullableEnumDiscountTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  discountValue: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  unitPriceAgreed: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  taxRate: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  subtotal: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  img: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  productType: z.union([ProductTypeSchema, z.lazy(() => NullableEnumProductTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  kind: z.union([OrderItemKindSchema, z.lazy(() => EnumOrderItemKindFieldUpdateOperationsInputObjectSchema)]).optional(),
  serviceCatalogId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serviceScope: z.union([ServiceScopeSchema, z.lazy(() => NullableEnumServiceScopeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  linkedOrderItemId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  customerItemNote: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdFromFlow: z.union([OrderFlowTypeSchema, z.lazy(() => EnumOrderFlowTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema).optional(),
  other_OrderItem: z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema).optional()
}).strict();
export const OrderItemUncheckedUpdateWithoutProductInputObjectSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutProductInput>;
export const OrderItemUncheckedUpdateWithoutProductInputObjectZodSchema = makeSchema();
