import * as z from 'zod';
export const BrandFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  country: z.string().optional(),
  foundedYear: z.number().int().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  isAuthorized: z.boolean(),
  status: z.unknown(),
  description: z.string().optional(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  products: z.array(z.unknown())
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