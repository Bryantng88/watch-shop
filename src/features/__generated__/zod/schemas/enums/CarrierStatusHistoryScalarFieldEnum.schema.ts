import * as z from 'zod';

export const CarrierStatusHistoryScalarFieldEnumSchema = z.enum(['id', 'shipmentId', 'carrierCode', 'externalStatus', 'normalizedStatus', 'description', 'location', 'occurredAt', 'payloadJson', 'createdAt'])

export type CarrierStatusHistoryScalarFieldEnum = z.infer<typeof CarrierStatusHistoryScalarFieldEnumSchema>;