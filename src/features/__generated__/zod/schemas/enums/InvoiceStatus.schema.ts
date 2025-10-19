import * as z from 'zod';

export const InvoiceStatusSchema = z.enum(['DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'VOID', 'CANCELLED'])

export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;