import * as z from 'zod';
export const technicalPartCatalogUpsertResultSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  appliesTo: z.string(),
  partGroup: z.string(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
  note: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});