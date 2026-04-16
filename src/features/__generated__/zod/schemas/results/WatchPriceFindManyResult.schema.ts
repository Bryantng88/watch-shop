import * as z from 'zod';
export const WatchPriceFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});