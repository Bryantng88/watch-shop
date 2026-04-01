import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentArgsObjectSchema as TechnicalAssessmentArgsObjectSchema } from './TechnicalAssessmentArgs.schema';
import { ServiceCatalogArgsObjectSchema as ServiceCatalogArgsObjectSchema } from './ServiceCatalogArgs.schema';
import { SupplyCatalogArgsObjectSchema as SupplyCatalogArgsObjectSchema } from './SupplyCatalogArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  assessmentId: z.boolean().optional(),
  area: z.boolean().optional(),
  issueType: z.boolean().optional(),
  actionMode: z.boolean().optional(),
  serviceCatalogId: z.boolean().optional(),
  supplyCatalogId: z.boolean().optional(),
  note: z.boolean().optional(),
  estimatedCost: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  vendorId: z.boolean().optional(),
  vendorNameSnap: z.boolean().optional(),
  TechnicalAssessment: z.union([z.boolean(), z.lazy(() => TechnicalAssessmentArgsObjectSchema)]).optional(),
  ServiceCatalog: z.union([z.boolean(), z.lazy(() => ServiceCatalogArgsObjectSchema)]).optional(),
  SupplyCatalog: z.union([z.boolean(), z.lazy(() => SupplyCatalogArgsObjectSchema)]).optional(),
  Vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional()
}).strict();
export const TechnicalIssueSelectObjectSchema: z.ZodType<Prisma.TechnicalIssueSelect> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueSelect>;
export const TechnicalIssueSelectObjectZodSchema = makeSchema();
