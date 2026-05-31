import * as z from 'zod';

// prettier-ignore
export const ProductPostTargetResultSchema = z.object({
    productId: z.string(),
    postTargetId: z.string(),
    createdAt: z.date(),
    product: z.unknown(),
    postTarget: z.unknown()
}).strict();

export type ProductPostTargetResultType = z.infer<typeof ProductPostTargetResultSchema>;
