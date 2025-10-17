import * as z from 'zod';

export const AcquisitionScalarFieldEnumSchema = z.enum(['id', 'vendorId', 'customerId', 'type', 'acquiredAt', 'cost', 'currency', 'payoutStatus', 'refNo', 'notes', 'condition', 'warrantyUntil', 'createdAt', 'updatedAt'])

export type AcquisitionScalarFieldEnum = z.infer<typeof AcquisitionScalarFieldEnumSchema>;