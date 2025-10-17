import * as z from 'zod';

export const OrderScalarFieldEnumSchema = z.enum(['id', 'orderCode', 'customerId', 'shipName', 'shipPhone', 'shipEmail', 'shipAddress', 'shipWard', 'shipCity', 'subtotal', 'shippingFee', 'total', 'status', 'paymentStatus', 'paymentMethod', 'createdAt', 'updatedAt'])

export type OrderScalarFieldEnum = z.infer<typeof OrderScalarFieldEnumSchema>;