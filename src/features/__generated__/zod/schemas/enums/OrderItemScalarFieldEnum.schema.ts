import * as z from 'zod';

export const OrderItemScalarFieldEnumSchema = z.enum(['id', 'orderId', 'productId', 'variantId', 'title', 'listPrice', 'discountType', 'discountValue', 'unitPriceAgreed', 'taxRate', 'quantity', 'subtotal', 'img', 'createdAt', 'productType'])

export type OrderItemScalarFieldEnum = z.infer<typeof OrderItemScalarFieldEnumSchema>;