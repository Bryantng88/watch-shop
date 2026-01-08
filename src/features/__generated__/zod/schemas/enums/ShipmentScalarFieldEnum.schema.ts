import * as z from 'zod';

export const ShipmentScalarFieldEnumSchema = z.enum(['id', 'orderId', 'shipPhone', 'shipAddress', 'shipCity', 'shipDistrict', 'shipWard', 'carrier', 'trackingCode', 'shippingFee', 'currency', 'shippedAt', 'deliveredAt', 'notes', 'createdAt', 'updatedAt', 'status', 'refNo'])

export type ShipmentScalarFieldEnum = z.infer<typeof ShipmentScalarFieldEnumSchema>;