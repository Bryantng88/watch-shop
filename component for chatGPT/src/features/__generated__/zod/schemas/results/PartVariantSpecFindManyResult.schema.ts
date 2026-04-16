import * as z from 'zod';
export const PartVariantSpecFindManyResultSchema = z.object({
  data: z.array(z.object({
  variantId: z.string(),
  partType: z.unknown(),
  variant: z.unknown()
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