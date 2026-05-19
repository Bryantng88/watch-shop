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
export const OrderItemInputSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    productId: z.string().optional().nullable(),
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
    createdAt: z.date(),
    productType: ProductTypeSchema.optional().nullable(),
    kind: OrderItemKindSchema,
    serviceCatalogId: z.string().optional().nullable(),
    serviceScope: ServiceScopeSchema.optional().nullable(),
    linkedOrderItemId: z.string().optional().nullable(),
    customerItemNote: z.string().optional().nullable(),
    createdFromFlow: OrderFlowTypeSchema,
    updatedAt: z.date(),
    previousSaleStage: WatchSaleStageSchema.optional().nullable(),
    previousServiceStage: WatchServiceStageSchema.optional().nullable(),
    previousStockStage: WatchStockStageSchema.optional().nullable(),
    previousProductStatus: ProductStatusSchema.optional().nullable(),
    acquisitionItem: z.array(z.unknown()),
    linkedOrderItem: z.unknown().optional().nullable(),
    childOrderItems: z.array(z.unknown()),
    order: z.unknown(),
    product: z.unknown().optional().nullable(),
    serviceCatalog: z.unknown().optional().nullable(),
    serviceRequest: z.array(z.unknown())
}).strict();

export type OrderItemInputType = z.infer<typeof OrderItemInputSchema>;
