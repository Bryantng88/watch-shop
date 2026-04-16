import * as z from 'zod';

// prettier-ignore
export const MarketSegmentInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    WatchSpec: z.array(z.unknown())
}).strict();

export type MarketSegmentInputType = z.infer<typeof MarketSegmentInputSchema>;
