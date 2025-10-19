import * as z from 'zod';

export const PaymentScalarFieldEnumSchema = z.enum(['id', 'invoiceId', 'method', 'amount', 'currency', 'paidAt', 'reference', 'note', 'createdAt'])

export type PaymentScalarFieldEnum = z.infer<typeof PaymentScalarFieldEnumSchema>;