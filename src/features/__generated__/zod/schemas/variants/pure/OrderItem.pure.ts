import * as z from 'zod';

import { DiscountTypeSchema } from '../../enums/DiscountType.schema';
import { ProductTypeSchema } from '../../enums/ProductType.schema';
import { OrderItemKindSchema } from '../../enums/OrderItemKind.schema';
import { ServiceScopeSchema } from '../../enums/ServiceScope.schema';
import { OrderFlowTypeSchema } from '../../enums/OrderFlowType.schema';
// prettier-ignore
export const OrderItemModelSchema = z.object({
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
    AcquisitionItem: z.array(z.unknown()),
    OrderItem: z.unknown().nullable(),
    other_OrderItem: z.array(z.unknown()),
    Order: z.unknown(),
    Product: z.unknown().nullable(),
    serviceCatalog: z.unknown().nullable(),
    ServiceRequest: z.array(z.unknown())
}).strict();

export type OrderItemPureType = z.infer<typeof OrderItemModelSchema>;
