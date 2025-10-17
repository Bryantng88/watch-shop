import * as z from 'zod';

// prettier-ignore
export const InvoiceItemResultSchema = z.object({
    id: z.string(),
    invoiceId: z.string(),
    productId: z.string().nullable(),
    variantId: z.string().nullable(),
    title: z.string(),
    description: z.string().nullable(),
    quantity: z.number(),
    unitPrice: z.number(),
    discount: z.number(),
    taxRate: z.number(),
    lineTotal: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    invoice: z.unknown(),
    product: z.unknown().nullable(),
    variant: z.unknown().nullable()
}).strict();

export type InvoiceItemResultType = z.infer<typeof InvoiceItemResultSchema>;
