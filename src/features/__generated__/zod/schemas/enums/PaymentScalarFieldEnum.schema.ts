import * as z from 'zod';

export const PaymentScalarFieldEnumSchema = z.enum(['id', 'method', 'amount', 'currency', 'paidAt', 'reference', 'note', 'createdAt', 'direction', 'status', 'order_id', 'service_request_id', 'vendor_id', 'acquisition_id'])

export type PaymentScalarFieldEnum = z.infer<typeof PaymentScalarFieldEnumSchema>;