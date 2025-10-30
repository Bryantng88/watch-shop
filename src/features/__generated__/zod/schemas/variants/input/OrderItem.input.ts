import * as z from 'zod';

// prettier-ignore
export const OrderItemInputSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    productId: z.string().optional().nullable(),
    variantId: z.string().optional().nullable(),
    title: z.string(),
    listPriceAtOrder: z.number(),
    discountType: z.string().optional().nullable(),
    discountValue: z.number().optional().nullable(),
    unitPriceAgreed: z.number(),
    taxRate: z.number().optional().nullable(),
    quantity: z.number().int(),
    subtotal: z.number(),
    img: z.string().optional().nullable(),
    createdAt: z.date(),
    AcquisitionItem: z.array(z.unknown()),
    order: z.unknown(),
    Product: z.unknown().optional().nullable(),
    ServiceRequest: z.array(z.unknown())
}).strict();

export type OrderItemInputType = z.infer<typeof OrderItemInputSchema>;
