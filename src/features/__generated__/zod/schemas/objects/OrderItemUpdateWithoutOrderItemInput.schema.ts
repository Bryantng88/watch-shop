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
import { AcquisitionItemUpdateManyWithoutSourceOrderItemNestedInputObjectSchema as AcquisitionItemUpdateManyWithoutSourceOrderItemNestedInputObjectSchema } from './AcquisitionItemUpdateManyWithoutSourceOrderItemNestedInput.schema';
import { OrderItemUpdateManyWithoutOrderItemNestedInputObjectSchema as OrderItemUpdateManyWithoutOrderItemNestedInputObjectSchema } from './OrderItemUpdateManyWithoutOrderItemNestedInput.schema';
import { OrderUpdateOneRequiredWithoutItemsNestedInputObjectSchema as OrderUpdateOneRequiredWithoutItemsNestedInputObjectSchema } from './OrderUpdateOneRequiredWithoutItemsNestedInput.schema';
import { ProductUpdateOneWithoutOrderItemsNestedInputObjectSchema as ProductUpdateOneWithoutOrderItemsNestedInputObjectSchema } from './ProductUpdateOneWithoutOrderItemsNestedInput.schema';
import { ServiceCatalogUpdateOneWithoutOrderItemNestedInputObjectSchema as ServiceCatalogUpdateOneWithoutOrderItemNestedInputObjectSchema } from './ServiceCatalogUpdateOneWithoutOrderItemNestedInput.schema';
import { ServiceRequestUpdateManyWithoutOrderItemNestedInputObjectSchema as ServiceRequestUpdateManyWithoutOrderItemNestedInputObjectSchema } from './ServiceRequestUpdateManyWithoutOrderItemNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
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
  customerItemNote: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  acquisitionItem: z.lazy(() => AcquisitionItemUpdateManyWithoutSourceOrderItemNestedInputObjectSchema).optional(),
  other_OrderItem: z.lazy(() => OrderItemUpdateManyWithoutOrderItemNestedInputObjectSchema).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutItemsNestedInputObjectSchema).optional(),
  Product: z.lazy(() => ProductUpdateOneWithoutOrderItemsNestedInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogUpdateOneWithoutOrderItemNestedInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUpdateManyWithoutOrderItemNestedInputObjectSchema).optional()
}).strict();
export const OrderItemUpdateWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateWithoutOrderItemInput>;
export const OrderItemUpdateWithoutOrderItemInputObjectZodSchema = makeSchema();
