import * as z from 'zod';

export const PurchaseRequestScalarFieldEnumSchema = z.enum(['id', 'reference', 'status', 'outcome', 'channel', 'externalRequestId', 'requestKey', 'requestHash', 'fingerprintHash', 'customerName', 'phone', 'contactPreference', 'address', 'city', 'district', 'ward', 'customerNote', 'processingNote', 'completionReason', 'assignedUserId', 'followUpAt', 'processingStartedAt', 'completedAt', 'orderId', 'createdAt', 'updatedAt'])

export type PurchaseRequestScalarFieldEnum = z.infer<typeof PurchaseRequestScalarFieldEnumSchema>;