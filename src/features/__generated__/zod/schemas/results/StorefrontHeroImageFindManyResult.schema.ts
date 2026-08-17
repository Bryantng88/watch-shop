import * as z from 'zod';
export const StorefrontHeroImageFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  storageKey: z.string(),
  derivativeKey: z.string().optional(),
  originalFileName: z.string(),
  altText: z.string().optional(),
  mimeType: z.string(),
  sizeBytes: z.number().int(),
  width: z.number().int(),
  height: z.number().int(),
  focalX: z.number().int(),
  focalY: z.number().int(),
  overlayOpacity: z.number().int(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
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