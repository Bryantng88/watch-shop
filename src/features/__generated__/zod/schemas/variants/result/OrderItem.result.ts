import * as z from 'zod';

// prettier-ignore
export const OrderItemResultSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    productId: z.string().nullable(),
    title: z.string(),
    price: z.number(),
    quantity: z.number().int(),
    subtotal: z.number(),
    img: z.string().nullable(),
    createdAt: z.date(),
    AcquisitionItem: z.array(z.unknown()),
    order: z.unknown(),
    Product: z.unknown().nullable(),
    ServiceRequest: z.array(z.unknown())
}).strict();

export type OrderItemResultType = z.infer<typeof OrderItemResultSchema>;
