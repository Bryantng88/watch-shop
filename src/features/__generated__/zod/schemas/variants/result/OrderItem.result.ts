import * as z from 'zod';

import { DiscountTypeSchema } from '../../enums/DiscountType.schema';
import { ProductTypeSchema } from '../../enums/ProductType.schema';
import { OrderItemKindSchema } from '../../enums/OrderItemKind.schema';
import { ServiceScopeSchema } from '../../enums/ServiceScope.schema';
import { OrderFlowTypeSchema } from '../../enums/OrderFlowType.schema';
import { WatchSaleStageSchema } from '../../enums/WatchSaleStage.schema';
import { WatchServiceStageSchema } from '../../enums/WatchServiceStage.schema';
import { WatchStockStageSchema } from '../../enums/WatchStockStage.schema';
import { ProductStatusSchema } from '../../enums/ProductStatus.schema';
// prettier-ignore
export const OrderItemResultSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    productId: z.string().nullable(),
    variantId: z.string().nullable(),
    title: z.string(),
    listPrice: z.number(),
    discountType: DiscountTypeSchema.nullable(),
    discountValue: z.number().nullable(),
    unitPriceAgreed: z.number(),
    taxRate: z.number().nullable(),
    quantity: z.number().int(),
    subtotal: z.number(),
    img: z.string().nullable(),
    createdAt: z.date(),
    productType: ProductTypeSchema.nullable(),
    kind: OrderItemKindSchema,
    serviceCatalogId: z.string().nullable(),
    serviceScope: ServiceScopeSchema.nullable(),
    linkedOrderItemId: z.string().nullable(),
    customerItemNote: z.string().nullable(),
    createdFromFlow: OrderFlowTypeSchema,
    updatedAt: z.date(),
    previousSaleStage: WatchSaleStageSchema.nullable(),
    previousServiceStage: WatchServiceStageSchema.nullable(),
    previousStockStage: WatchStockStageSchema.nullable(),
    previousProductStatus: ProductStatusSchema.nullable(),
    acquisitionItem: z.array(z.unknown()),
    linkedOrderItem: z.unknown().nullable(),
    childOrderItems: z.array(z.unknown()),
    order: z.unknown(),
    product: z.unknown().nullable(),
    serviceCatalog: z.unknown().nullable(),
    serviceRequest: z.array(z.unknown())
}).strict();

export type OrderItemResultType = z.infer<typeof OrderItemResultSchema>;
