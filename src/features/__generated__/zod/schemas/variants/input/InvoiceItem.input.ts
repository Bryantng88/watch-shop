import * as z from 'zod';

// prettier-ignore
export const InvoiceItemInputSchema = z.object({
    id: z.string(),
    invoiceId: z.string(),
    productId: z.string().optional().nullable(),
    variantId: z.string().optional().nullable(),
    title: z.string(),
    description: z.string().optional().nullable(),
    quantity: z.number(),
    unitPrice: z.number(),
    discount: z.number(),
    taxRate: z.number(),
    lineTotal: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    Invoice: z.unknown(),
    Product: z.unknown().optional().nullable(),
    ProductVariant: z.unknown().optional().nullable()
}).strict();

export type InvoiceItemInputType = z.infer<typeof InvoiceItemInputSchema>;
