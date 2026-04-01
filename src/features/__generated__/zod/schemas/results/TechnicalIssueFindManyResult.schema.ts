import * as z from 'zod';
export const TechnicalIssueFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  assessmentId: z.string(),
  area: z.string().optional(),
  issueType: z.unknown(),
  actionMode: z.unknown(),
  serviceCatalogId: z.string().optional(),
  supplyCatalogId: z.string().optional(),
  note: z.string().optional(),
  estimatedCost: z.number().optional(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  TechnicalAssessment: z.unknown(),
  ServiceCatalog: z.unknown().optional(),
  SupplyCatalog: z.unknown().optional()
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