import * as z from 'zod';

// prettier-ignore
export const MarketSegmentInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    watchSpecs: z.array(z.unknown())
}).strict();

export type MarketSegmentInputType = z.infer<typeof MarketSegmentInputSchema>;
