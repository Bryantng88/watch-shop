import * as z from 'zod';

export const InvoiceTypeSchema = z.enum(['SALE', 'PURCHASE', 'SERVICE', 'ADJUSTMENT', 'REFUND'])

export type InvoiceType = z.infer<typeof InvoiceTypeSchema>;