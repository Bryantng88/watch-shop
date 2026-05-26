import * as z from 'zod';

export const OrderScalarFieldEnumSchema = z.enum(['id', 'refNo', 'customerId', 'shipPhone', 'shipAddress', 'shipWard', 'shipCity', 'subtotal', 'shippingAmount', 'status', 'paymentStatus', 'paymentMethod', 'depositPaymentMethod', 'createdAt', 'updatedAt', 'customerName', 'notes', 'shipDistrict', 'hasShipment', 'reserveType', 'reserveUntil', 'depositRequired', 'depositPaid', 'source', 'verificationStatus', 'quick_from_product_id', 'quickFromProductId', 'quickFlowType'])

export type OrderScalarFieldEnum = z.infer<typeof OrderScalarFieldEnumSchema>;