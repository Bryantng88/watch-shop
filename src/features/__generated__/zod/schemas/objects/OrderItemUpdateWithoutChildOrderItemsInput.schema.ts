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
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema';
import { NullableEnumWatchSaleStageFieldUpdateOperationsInputObjectSchema as NullableEnumWatchSaleStageFieldUpdateOperationsInputObjectSchema } from './NullableEnumWatchSaleStageFieldUpdateOperationsInput.schema';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema';
import { NullableEnumWatchServiceStageFieldUpdateOperationsInputObjectSchema as NullableEnumWatchServiceStageFieldUpdateOperationsInputObjectSchema } from './NullableEnumWatchServiceStageFieldUpdateOperationsInput.schema';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema';
import { NullableEnumWatchStockStageFieldUpdateOperationsInputObjectSchema as NullableEnumWatchStockStageFieldUpdateOperationsInputObjectSchema } from './NullableEnumWatchStockStageFieldUpdateOperationsInput.schema';
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { NullableEnumProductStatusFieldUpdateOperationsInputObjectSchema as NullableEnumProductStatusFieldUpdateOperationsInputObjectSchema } from './NullableEnumProductStatusFieldUpdateOperationsInput.schema';
import { AcquisitionItemUpdateManyWithoutOrderItemNestedInputObjectSchema as AcquisitionItemUpdateManyWithoutOrderItemNestedInputObjectSchema } from './AcquisitionItemUpdateManyWithoutOrderItemNestedInput.schema';
import { OrderItemUpdateOneWithoutChildOrderItemsNestedInputObjectSchema as OrderItemUpdateOneWithoutChildOrderItemsNestedInputObjectSchema } from './OrderItemUpdateOneWithoutChildOrderItemsNestedInput.schema';
import { OrderUpdateOneRequiredWithoutOrderItemNestedInputObjectSchema as OrderUpdateOneRequiredWithoutOrderItemNestedInputObjectSchema } from './OrderUpdateOneRequiredWithoutOrderItemNestedInput.schema';
import { ProductUpdateOneWithoutOrderItemNestedInputObjectSchema as ProductUpdateOneWithoutOrderItemNestedInputObjectSchema } from './ProductUpdateOneWithoutOrderItemNestedInput.schema';
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
  createdFromFlow: z.union([OrderFlowTypeSchema, z.lazy(() => EnumOrderFlowTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  previousSaleStage: z.union([WatchSaleStageSchema, z.lazy(() => NullableEnumWatchSaleStageFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  previousServiceStage: z.union([WatchServiceStageSchema, z.lazy(() => NullableEnumWatchServiceStageFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  previousStockStage: z.union([WatchStockStageSchema, z.lazy(() => NullableEnumWatchStockStageFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  previousProductStatus: z.union([ProductStatusSchema, z.lazy(() => NullableEnumProductStatusFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  acquisitionItem: z.lazy(() => AcquisitionItemUpdateManyWithoutOrderItemNestedInputObjectSchema).optional(),
  linkedOrderItem: z.lazy(() => OrderItemUpdateOneWithoutChildOrderItemsNestedInputObjectSchema).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutOrderItemNestedInputObjectSchema).optional(),
  product: z.lazy(() => ProductUpdateOneWithoutOrderItemNestedInputObjectSchema).optional(),
  serviceCatalog: z.lazy(() => ServiceCatalogUpdateOneWithoutOrderItemNestedInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUpdateManyWithoutOrderItemNestedInputObjectSchema).optional()
}).strict();
export const OrderItemUpdateWithoutChildOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateWithoutChildOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateWithoutChildOrderItemsInput>;
export const OrderItemUpdateWithoutChildOrderItemsInputObjectZodSchema = makeSchema();
