import * as z from 'zod';
export const technicalAppearanceIssueCatalogFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  code: z.string(),
  area: z.string(),
  label: z.string(),
  deductionScore: z.number().int(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
  note: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
}));