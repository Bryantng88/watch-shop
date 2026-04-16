import * as z from 'zod';

// prettier-ignore
export const MarketSegmentResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    WatchSpec: z.array(z.unknown())
}).strict();

export type MarketSegmentResultType = z.infer<typeof MarketSegmentResultSchema>;
