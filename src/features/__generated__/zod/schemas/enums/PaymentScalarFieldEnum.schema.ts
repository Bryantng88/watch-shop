import * as z from 'zod';

export const PaymentScalarFieldEnumSchema = z.enum(['id', 'method', 'amount', 'currency', 'paidAt', 'reference', 'note', 'createdAt', 'direction', 'order_id', 'service_request_id', 'vendor_id', 'acquisition_id', 'status', 'purpose'])

export type PaymentScalarFieldEnum = z.infer<typeof PaymentScalarFieldEnumSchema>;