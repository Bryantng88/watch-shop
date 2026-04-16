import * as z from 'zod';
export const WatchPriceUpsertResultSchema = z.object({
  id: z.string(),
  watchId: z.string(),
  costPrice: z.number().optional(),
  serviceCost: z.number().optional(),
  landedCost: z.number().optional(),
  listPrice: z.number().optional(),
  salePrice: z.number().optional(),
  minPrice: z.number().optional(),
  pricingNote: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  watch: z.unknown()
});