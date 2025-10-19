import * as z from 'zod';

// prettier-ignore
export const AcquisitionItemInputSchema = z.object({
    id: z.string(),
    acquisitionId: z.string(),
    productId: z.string().optional().nullable(),
    variantId: z.string().optional().nullable(),
    quantity: z.number().int(),
    unitCost: z.number().optional().nullable(),
    currency: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    sourceOrderItemId: z.string().optional().nullable(),
    createdAt: z.date(),
    acquisition: z.unknown(),
    product: z.unknown().optional().nullable(),
    sourceOrderItem: z.unknown().optional().nullable(),
    variant: z.unknown().optional().nullable()
}).strict();

export type AcquisitionItemInputType = z.infer<typeof AcquisitionItemInputSchema>;
