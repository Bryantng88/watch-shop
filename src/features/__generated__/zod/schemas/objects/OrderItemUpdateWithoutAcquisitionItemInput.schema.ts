import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { discount_typeSchema } from '../enums/discount_type.schema';
import { NullableEnumdiscount_typeFieldUpdateOperationsInputObjectSchema as NullableEnumdiscount_typeFieldUpdateOperationsInputObjectSchema } from './NullableEnumdiscount_typeFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { NullableEnumProductTypeFieldUpdateOperationsInputObjectSchema as NullableEnumProductTypeFieldUpdateOperationsInputObjectSchema } from './NullableEnumProductTypeFieldUpdateOperationsInput.schema';
import { orderitemkindSchema } from '../enums/orderitemkind.schema';
import { EnumorderitemkindFieldUpdateOperationsInputObjectSchema as EnumorderitemkindFieldUpdateOperationsInputObjectSchema } from './EnumorderitemkindFieldUpdateOperationsInput.schema';
import { OrderUpdateOneRequiredWithoutItemsNestedInputObjectSchema as OrderUpdateOneRequiredWithoutItemsNestedInputObjectSchema } from './OrderUpdateOneRequiredWithoutItemsNestedInput.schema';
import { ProductUpdateOneWithoutOrderItemsNestedInputObjectSchema as ProductUpdateOneWithoutOrderItemsNestedInputObjectSchema } from './ProductUpdateOneWithoutOrderItemsNestedInput.schema';
import { ServiceCatalogUpdateOneWithoutOrderItemNestedInputObjectSchema as ServiceCatalogUpdateOneWithoutOrderItemNestedInputObjectSchema } from './ServiceCatalogUpdateOneWithoutOrderItemNestedInput.schema';
import { ServiceRequestUpdateManyWithoutOrderItemNestedInputObjectSchema as ServiceRequestUpdateManyWithoutOrderItemNestedInputObjectSchema } from './ServiceRequestUpdateManyWithoutOrderItemNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  variantId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  listPrice: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  discountType: z.union([discount_typeSchema, z.lazy(() => NullableEnumdiscount_typeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  discountValue: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  unitPriceAgreed: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  taxRate: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  subtotal: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  img: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  productType: z.union([ProductTypeSchema, z.lazy(() => NullableEnumProductTypeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  kind: z.union([orderitemkindSchema, z.lazy(() => EnumorderitemkindFieldUpdateOperationsInputObjectSchema)]).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutItemsNestedInputObjectSchema).optional(),
  Product: z.lazy(() => ProductUpdateOneWithoutOrderItemsNestedInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogUpdateOneWithoutOrderItemNestedInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUpdateManyWithoutOrderItemNestedInputObjectSchema).optional()
}).strict();
export const OrderItemUpdateWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateWithoutAcquisitionItemInput>;
export const OrderItemUpdateWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
