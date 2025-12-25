import * as z from 'zod';

import { discount_typeSchema } from '../../enums/discount_type.schema';
// prettier-ignore
export const OrderItemModelSchema = z.object({
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
    acquisitionItem: z.array(z.unknown()),
    order: z.unknown(),
    Product: z.unknown().nullable(),
    serviceRequest: z.array(z.unknown())
}).strict();

export type OrderItemPureType = z.infer<typeof OrderItemModelSchema>;
