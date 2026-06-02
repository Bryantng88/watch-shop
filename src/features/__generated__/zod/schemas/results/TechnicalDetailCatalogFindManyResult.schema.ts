import * as z from 'zod';
export const TechnicalDetailCatalogFindManyResultSchema = z.object({
  data: z.array(z.object({
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