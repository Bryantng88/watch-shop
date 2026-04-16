import * as z from 'zod';
export const MarketSegmentFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  watchSpecs: z.array(z.unknown())
}));