import * as z from 'zod';
export const WatchFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  productId: z.string(),
  legacyVariantId: z.string().optional(),
  acquisitionId: z.string().optional(),
  stockState: z.string().optional(),
  saleState: z.string().optional(),
  serviceState: z.string().optional(),
  siteChannel: z.unknown(),
  gender: z.unknown(),
  conditionGrade: z.string().optional(),
  movementType: z.unknown().optional(),
  movementCalibre: z.string().optional(),
  serialNumber: z.string().optional(),
  yearText: z.string().optional(),
  style: z.unknown().optional(),
  hasBox: z.boolean(),
  hasPapers: z.boolean(),
  specStatus: z.unknown(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  product: z.unknown(),
  watchContent: z.unknown().optional(),
  watchPrice: z.unknown().optional(),
  watchSpecV2: z.unknown().optional()
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