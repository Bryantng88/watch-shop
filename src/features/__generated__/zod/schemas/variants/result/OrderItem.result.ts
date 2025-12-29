import * as z from 'zod';

import { discount_typeSchema } from '../../enums/discount_type.schema';
import { ProductTypeSchema } from '../../enums/ProductType.schema';
// prettier-ignore
export const OrderItemResultSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    productId: z.string().nullable(),
    variantId: z.string().nullable(),
    title: z.string(),
    listPrice: z.number(),
    discountType: discount_typeSchema.nullable(),
    discountValue: z.number().nullable(),
    unitPriceAgreed: z.number(),
    taxRate: z.number().nullable(),
    quantity: z.number().int(),
    subtotal: z.number(),
    img: z.string().nullable(),
    createdAt: z.date(),
    productType: ProductTypeSchema.nullable(),
    acquisitionItem: z.array(z.unknown()),
    order: z.unknown(),
    Product: z.unknown().nullable(),
    serviceRequest: z.array(z.unknown())
}).strict();

export type OrderItemResultType = z.infer<typeof OrderItemResultSchema>;
