import * as z from 'zod';
export const TechnicalDetailCatalogFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  area: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  technicalIssues: z.array(z.unknown())
}));