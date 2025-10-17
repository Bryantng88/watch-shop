import * as z from 'zod';

// prettier-ignore
export const OrderItemInputSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    productId: z.string().optional().nullable(),
    title: z.string(),
    price: z.number(),
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
