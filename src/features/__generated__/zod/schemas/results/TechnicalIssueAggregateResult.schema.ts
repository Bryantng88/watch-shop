import * as z from 'zod';
export const TechnicalIssueAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    assessmentId: z.number(),
    area: z.number(),
    issueType: z.number(),
    actionMode: z.number(),
    serviceCatalogId: z.number(),
    supplyCatalogId: z.number(),
    note: z.number(),
    estimatedCost: z.number(),
    sortOrder: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    vendorId: z.number(),
    vendorNameSnap: z.number(),
    mechanicalPartCatalogId: z.number(),
    TechnicalAssessment: z.number(),
    MechanicalPartCatalog: z.number(),
    ServiceCatalog: z.number(),
    SupplyCatalog: z.number(),
    Vendor: z.number()
  }).optional(),
  _sum: z.object({
    estimatedCost: z.number().nullable(),
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    estimatedCost: z.number().nullable(),
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    assessmentId: z.string().nullable(),
    area: z.string().nullable(),
    serviceCatalogId: z.string().nullable(),
    supplyCatalogId: z.string().nullable(),
    note: z.string().nullable(),
    estimatedCost: z.number().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    vendorId: z.string().nullable(),
    vendorNameSnap: z.string().nullable(),
    mechanicalPartCatalogId: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    assessmentId: z.string().nullable(),
    area: z.string().nullable(),
    serviceCatalogId: z.string().nullable(),
    supplyCatalogId: z.string().nullable(),
    note: z.string().nullable(),
    estimatedCost: z.number().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    vendorId: z.string().nullable(),
    vendorNameSnap: z.string().nullable(),
    mechanicalPartCatalogId: z.string().nullable()
  }).nullable().optional()});