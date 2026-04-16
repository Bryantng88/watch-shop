import * as z from 'zod';
export const BrandUpdateResultSchema = z.nullable(z.object({
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
}));