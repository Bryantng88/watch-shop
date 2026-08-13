import * as z from 'zod';

export const ShipmentScalarFieldEnumSchema = z.enum(['id', 'orderId', 'shipPhone', 'shipAddress', 'shipCity', 'shipDistrict', 'shipWard', 'carrier', 'trackingCode', 'shippingAmount', 'currency', 'shippedAt', 'deliveredAt', 'notes', 'createdAt', 'updatedAt', 'status', 'shippingFeePayer', 'carrierCode', 'carrierEnvironment', 'externalOrderCode', 'carrierStatus', 'carrierStatusText', 'carrierSyncedAt', 'carrierCreatedAt', 'estimatedDeliveryAt', 'refNo', 'orderRefNo', 'customerName'])

export type ShipmentScalarFieldEnum = z.infer<typeof ShipmentScalarFieldEnumSchema>;