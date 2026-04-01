import * as z from 'zod';
export const TechnicalIssueUpdateResultSchema = z.nullable(z.object({
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
  vendorId: z.string().optional(),
  vendorNameSnap: z.string().optional(),
  TechnicalAssessment: z.unknown(),
  ServiceCatalog: z.unknown().optional(),
  SupplyCatalog: z.unknown().optional(),
  Vendor: z.unknown().optional()
}));