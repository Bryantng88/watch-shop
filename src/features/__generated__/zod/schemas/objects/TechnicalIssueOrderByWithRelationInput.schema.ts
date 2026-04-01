import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TechnicalAssessmentOrderByWithRelationInputObjectSchema as TechnicalAssessmentOrderByWithRelationInputObjectSchema } from './TechnicalAssessmentOrderByWithRelationInput.schema';
import { ServiceCatalogOrderByWithRelationInputObjectSchema as ServiceCatalogOrderByWithRelationInputObjectSchema } from './ServiceCatalogOrderByWithRelationInput.schema';
import { SupplyCatalogOrderByWithRelationInputObjectSchema as SupplyCatalogOrderByWithRelationInputObjectSchema } from './SupplyCatalogOrderByWithRelationInput.schema';
import { VendorOrderByWithRelationInputObjectSchema as VendorOrderByWithRelationInputObjectSchema } from './VendorOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  assessmentId: SortOrderSchema.optional(),
  area: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  issueType: SortOrderSchema.optional(),
  actionMode: SortOrderSchema.optional(),
  serviceCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  supplyCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  estimatedCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  vendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorNameSnap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  TechnicalAssessment: z.lazy(() => TechnicalAssessmentOrderByWithRelationInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogOrderByWithRelationInputObjectSchema).optional(),
  SupplyCatalog: z.lazy(() => SupplyCatalogOrderByWithRelationInputObjectSchema).optional(),
  Vendor: z.lazy(() => VendorOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const TechnicalIssueOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TechnicalIssueOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueOrderByWithRelationInput>;
export const TechnicalIssueOrderByWithRelationInputObjectZodSchema = makeSchema();
