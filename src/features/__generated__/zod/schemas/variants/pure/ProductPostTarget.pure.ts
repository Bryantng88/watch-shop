import * as z from 'zod';

// prettier-ignore
export const ProductPostTargetModelSchema = z.object({
    productId: z.string(),
    postTargetId: z.string(),
    createdAt: z.date(),
    product: z.unknown(),
    postTarget: z.unknown()
}).strict();

export type ProductPostTargetPureType = z.infer<typeof ProductPostTargetModelSchema>;
