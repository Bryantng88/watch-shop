import * as z from 'zod';

export const AcquisitionScalarFieldEnumSchema = z.enum(['id', 'vendorId', 'customerId', 'type', 'acquiredAt', 'totalAmount', 'currency', 'payoutStatus', 'accquisitionStt', 'refNo', 'notes', 'condition', 'warrantyUntil', 'audienceSegment', 'createdAt', 'updatedAt', 'sentAt', 'returnedAt'])

export type AcquisitionScalarFieldEnum = z.infer<typeof AcquisitionScalarFieldEnumSchema>;