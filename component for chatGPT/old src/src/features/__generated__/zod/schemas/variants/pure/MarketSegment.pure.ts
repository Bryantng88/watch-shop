import * as z from 'zod';

// prettier-ignore
export const MarketSegmentModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    watchSpecs: z.array(z.unknown())
}).strict();

export type MarketSegmentPureType = z.infer<typeof MarketSegmentModelSchema>;
