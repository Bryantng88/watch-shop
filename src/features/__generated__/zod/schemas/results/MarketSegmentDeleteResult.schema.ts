import * as z from 'zod';
export const MarketSegmentDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  WatchSpec: z.array(z.unknown())
}));