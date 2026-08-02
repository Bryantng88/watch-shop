import * as z from 'zod';
export const StrapCatalogOptionFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  kind: z.unknown(),
  code: z.string(),
  name: z.string(),
  colorHex: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
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