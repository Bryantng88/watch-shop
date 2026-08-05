import * as z from 'zod';

export const IntegrationIngressReceiptScalarFieldEnumSchema = z.enum(['id', 'channel', 'keyId', 'nonce', 'eventId', 'eventType', 'requestHash', 'status', 'responseJson', 'lastError', 'createdAt', 'updatedAt', 'expiresAt'])

export type IntegrationIngressReceiptScalarFieldEnum = z.infer<typeof IntegrationIngressReceiptScalarFieldEnumSchema>;