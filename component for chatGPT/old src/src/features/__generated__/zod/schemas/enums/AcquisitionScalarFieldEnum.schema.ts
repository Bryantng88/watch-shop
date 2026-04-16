import * as z from 'zod';

export const AcquisitionScalarFieldEnumSchema = z.enum(['id', 'vendorId', 'customerId', 'type', 'acquiredAt', 'cost', 'currency', 'payoutStatus', 'accquisitionStt', 'refNo', 'notes', 'condition', 'warrantyUntil', 'createdAt', 'updatedAt', 'sentAt', 'returnedAt'])

export type AcquisitionScalarFieldEnum = z.infer<typeof AcquisitionScalarFieldEnumSchema>;