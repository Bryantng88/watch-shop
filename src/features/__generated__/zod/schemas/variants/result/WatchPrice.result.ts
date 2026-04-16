import * as z from 'zod';

// prettier-ignore
export const WatchPriceResultSchema = z.object({
    id: z.string(),
    watchId: z.string(),
    costPrice: z.number().nullable(),
    serviceCost: z.number().nullable(),
    landedCost: z.number().nullable(),
    listPrice: z.number().nullable(),
    salePrice: z.number().nullable(),
    minPrice: z.number().nullable(),
    pricingNote: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    watch: z.unknown()
}).strict();

export type WatchPriceResultType = z.infer<typeof WatchPriceResultSchema>;
