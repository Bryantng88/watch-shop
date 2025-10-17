import * as z from 'zod';

// prettier-ignore
export const AcquisitionItemResultSchema = z.object({
    id: z.string(),
    acquisitionId: z.string(),
    productId: z.string().nullable(),
    variantId: z.string().nullable(),
    quantity: z.number().int(),
    unitCost: z.number().nullable(),
    currency: z.string().nullable(),
    notes: z.string().nullable(),
    sourceOrderItemId: z.string().nullable(),
    createdAt: z.date(),
    acquisition: z.unknown(),
    product: z.unknown().nullable(),
    sourceOrderItem: z.unknown().nullable(),
    variant: z.unknown().nullable()
}).strict();

export type AcquisitionItemResultType = z.infer<typeof AcquisitionItemResultSchema>;
