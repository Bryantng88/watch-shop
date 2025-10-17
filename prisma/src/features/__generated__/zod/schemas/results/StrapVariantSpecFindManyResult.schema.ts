import * as z from 'zod';
export const StrapVariantSpecFindManyResultSchema = z.object({
  data: z.array(z.object({
  variantId: z.string(),
  widthMM: z.number().int(),
  lengthLabel: z.unknown().optional(),
  color: z.string().optional(),
  material: z.unknown(),
  quickRelease: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
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