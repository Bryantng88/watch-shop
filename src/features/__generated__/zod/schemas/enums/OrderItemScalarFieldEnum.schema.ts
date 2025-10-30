import * as z from 'zod';

export const OrderItemScalarFieldEnumSchema = z.enum(['id', 'orderId', 'productId', 'variantId', 'title', 'listPriceAtOrder', 'discountType', 'discountValue', 'unitPriceAgreed', 'taxRate', 'quantity', 'subtotal', 'img', 'createdAt'])

export type OrderItemScalarFieldEnum = z.infer<typeof OrderItemScalarFieldEnumSchema>;