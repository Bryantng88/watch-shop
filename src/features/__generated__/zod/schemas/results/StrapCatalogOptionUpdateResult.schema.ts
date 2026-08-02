import * as z from 'zod';
export const StrapCatalogOptionUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  kind: z.unknown(),
  code: z.string(),
  name: z.string(),
  colorHex: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date()
}));