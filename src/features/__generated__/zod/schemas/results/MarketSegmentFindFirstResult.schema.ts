import * as z from 'zod';
export const MarketSegmentFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  WatchSpec: z.array(z.unknown())
}));