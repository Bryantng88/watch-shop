import * as z from 'zod';
export const MarketSegmentUpsertResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  watchSpecs: z.array(z.unknown())
});