import * as z from 'zod';

import { discount_typeSchema } from '../../enums/discount_type.schema';
import { ProductTypeSchema } from '../../enums/ProductType.schema';
// prettier-ignore
export const OrderItemInputSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    productId: z.string().optional().nullable(),
    variantId: z.string().optional().nullable(),
    title: z.string(),
    listPrice: z.number(),
    discountType: discount_typeSchema.optional().nullable(),
    discountValue: z.number().optional().nullable(),
    unitPriceAgreed: z.number(),
    taxRate: z.number().optional().nullable(),
    quantity: z.number().int(),
    subtotal: z.number(),
    img: z.string().optional().nullable(),
    createdAt: z.date(),
    productType: ProductTypeSchema.optional().nullable(),
    acquisitionItem: z.array(z.unknown()),
    order: z.unknown(),
    Product: z.unknown().optional().nullable(),
    serviceRequest: z.array(z.unknown())
}).strict();

export type OrderItemInputType = z.infer<typeof OrderItemInputSchema>;
