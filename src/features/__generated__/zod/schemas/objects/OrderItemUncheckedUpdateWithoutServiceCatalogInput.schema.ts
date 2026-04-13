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
import { orderflowtypeSchema } from '../enums/orderflowtype.schema';
import { EnumorderflowtypeFieldUpdateOperationsInputObjectSchema as EnumorderflowtypeFieldUpdateOperationsInputObjectSchema } from './EnumorderflowtypeFieldUpdateOperationsInput.schema';
import { AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemNestedInputObjectSchema as AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemNestedInputObjectSchema } from './AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemNestedInput.schema';
import { OrderItemUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema as OrderItemUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema } from './OrderItemUncheckedUpdateManyWithoutOrderItemNestedInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  orderId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  productId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
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
  serviceScope: z.union([ServiceScopeSchema, z.lazy(() => NullableEnumServiceScopeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  linkedOrderItemId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  customerItemNote: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdFromFlow: z.union([orderflowtypeSchema, z.lazy(() => EnumorderflowtypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  acquisitionItem: z.lazy(() => AcquisitionItemUncheckedUpdateManyWithoutSourceOrderItemNestedInputObjectSchema).optional(),
  other_OrderItem: z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutOrderItemNestedInputObjectSchema).optional()
}).strict();
export const OrderItemUncheckedUpdateWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutServiceCatalogInput>;
export const OrderItemUncheckedUpdateWithoutServiceCatalogInputObjectZodSchema = makeSchema();
