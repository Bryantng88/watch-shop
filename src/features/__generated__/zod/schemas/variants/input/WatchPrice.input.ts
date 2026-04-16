import * as z from 'zod';

// prettier-ignore
export const WatchPriceInputSchema = z.object({
    id: z.string(),
    watchId: z.string(),
    costPrice: z.number().optional().nullable(),
    serviceCost: z.number().optional().nullable(),
    landedCost: z.number().optional().nullable(),
    listPrice: z.number().optional().nullable(),
    salePrice: z.number().optional().nullable(),
    minPrice: z.number().optional().nullable(),
    pricingNote: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    watch: z.unknown()
}).strict();

export type WatchPriceInputType = z.infer<typeof WatchPriceInputSchema>;
