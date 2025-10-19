import * as z from 'zod';

export const OrderItemScalarFieldEnumSchema = z.enum(['id', 'orderId', 'productId', 'title', 'price', 'quantity', 'subtotal', 'img', 'createdAt'])

export type OrderItemScalarFieldEnum = z.infer<typeof OrderItemScalarFieldEnumSchema>;