import * as z from 'zod';
export const ProductCategoryUpsertResultSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  scope: z.unknown(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  Product: z.array(z.unknown())
});