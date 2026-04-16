import * as z from 'zod';

export const InvoiceItemScalarFieldEnumSchema = z.enum(['id', 'invoiceId', 'productId', 'variantId', 'title', 'description', 'quantity', 'unitPrice', 'discount', 'taxRate', 'lineTotal', 'createdAt', 'updatedAt'])

export type InvoiceItemScalarFieldEnum = z.infer<typeof InvoiceItemScalarFieldEnumSchema>;