import * as z from 'zod';

export const InvoiceScalarFieldEnumSchema = z.enum(['id', 'code', 'type', 'status', 'customerId', 'vendorId', 'orderId', 'acquisitionId', 'serviceRequestId', 'currency', 'subTotal', 'taxTotal', 'discountTotal', 'grandTotal', 'issuedAt', 'dueAt', 'notes', 'createdAt', 'updatedAt'])

export type InvoiceScalarFieldEnum = z.infer<typeof InvoiceScalarFieldEnumSchema>;