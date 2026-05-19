import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DiscountTypeSchema } from '../enums/DiscountType.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { OrderItemKindSchema } from '../enums/OrderItemKind.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { OrderFlowTypeSchema } from '../enums/OrderFlowType.schema';
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema';
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { AcquisitionItemCreateNestedManyWithoutOrderItemInputObjectSchema as AcquisitionItemCreateNestedManyWithoutOrderItemInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutOrderItemInput.schema';
import { OrderItemCreateNestedOneWithoutChildOrderItemsInputObjectSchema as OrderItemCreateNestedOneWithoutChildOrderItemsInputObjectSchema } from './OrderItemCreateNestedOneWithoutChildOrderItemsInput.schema';
import { OrderItemCreateNestedManyWithoutLinkedOrderItemInputObjectSchema as OrderItemCreateNestedManyWithoutLinkedOrderItemInputObjectSchema } from './OrderItemCreateNestedManyWithoutLinkedOrderItemInput.schema';
import { ProductCreateNestedOneWithoutOrderItemInputObjectSchema as ProductCreateNestedOneWithoutOrderItemInputObjectSchema } from './ProductCreateNestedOneWithoutOrderItemInput.schema';
import { ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema as ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema } from './ServiceCatalogCreateNestedOneWithoutOrderItemInput.schema';
import { ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema as ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  variantId: z.string().optional().nullable(),
  title: z.string(),
  listPrice: z.number(),
  discountType: DiscountTypeSchema.optional().nullable(),
  discountValue: z.number().optional().nullable(),
  unitPriceAgreed: z.number(),
  taxRate: z.number().optional().nullable(),
  quantity: z.number().int(),
  subtotal: z.number(),
  img: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  productType: ProductTypeSchema.optional().nullable(),
  kind: OrderItemKindSchema,
  serviceScope: ServiceScopeSchema.optional().nullable(),
  customerItemNote: z.string().optional().nullable(),
  createdFromFlow: OrderFlowTypeSchema.optional(),
  updatedAt: z.coerce.date().optional(),
  previousSaleStage: WatchSaleStageSchema.optional().nullable(),
  previousServiceStage: WatchServiceStageSchema.optional().nullable(),
  previousStockStage: WatchStockStageSchema.optional().nullable(),
  previousProductStatus: ProductStatusSchema.optional().nullable(),
  acquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutOrderItemInputObjectSchema).optional(),
  linkedOrderItem: z.lazy(() => OrderItemCreateNestedOneWithoutChildOrderItemsInputObjectSchema).optional(),
  childOrderItems: z.lazy(() => OrderItemCreateNestedManyWithoutLinkedOrderItemInputObjectSchema).optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutOrderItemInputObjectSchema).optional(),
  serviceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema).optional()
}).strict();
export const OrderItemCreateWithoutOrderInputObjectSchema: z.ZodType<Prisma.OrderItemCreateWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateWithoutOrderInput>;
export const OrderItemCreateWithoutOrderInputObjectZodSchema = makeSchema();
