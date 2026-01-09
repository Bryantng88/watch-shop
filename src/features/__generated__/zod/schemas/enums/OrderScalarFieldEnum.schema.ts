import * as z from 'zod';

export const OrderScalarFieldEnumSchema = z.enum(['id', 'refNo', 'customerId', 'shipPhone', 'shipAddress', 'shipWard', 'shipCity', 'subtotal', 'shippingFee', 'status', 'paymentStatus', 'paymentMethod', 'createdAt', 'updatedAt', 'customerName', 'notes', 'shipDistrict', 'hasShipment', 'reserveType', 'reserveUntil', 'depositRequired', 'depositPaid', 'source', 'verificationStatus'])

export type OrderScalarFieldEnum = z.infer<typeof OrderScalarFieldEnumSchema>;