import * as z from 'zod';

// prettier-ignore
export const ProductPostTargetInputSchema = z.object({
    productId: z.string(),
    postTargetId: z.string(),
    createdAt: z.date(),
    product: z.unknown(),
    postTarget: z.unknown()
}).strict();

export type ProductPostTargetInputType = z.infer<typeof ProductPostTargetInputSchema>;
