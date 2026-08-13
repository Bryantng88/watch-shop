import * as z from 'zod';

export const CarrierWebhookDeliveryScalarFieldEnumSchema = z.enum(['id', 'carrierCode', 'environment', 'externalEventId', 'externalOrderCode', 'payloadHash', 'payloadJson', 'signatureValid', 'status', 'receivedAt', 'processedAt', 'errorMessage'])

export type CarrierWebhookDeliveryScalarFieldEnum = z.infer<typeof CarrierWebhookDeliveryScalarFieldEnumSchema>;