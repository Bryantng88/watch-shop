import * as z from 'zod';
export const MarketSegmentCreateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  watchSpecs: z.array(z.unknown())
});