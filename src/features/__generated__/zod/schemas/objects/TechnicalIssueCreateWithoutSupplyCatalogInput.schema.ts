import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInput.schema';
import { ServiceCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema as ServiceCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogCreateNestedOneWithoutTechnicalIssueInput.schema';
import { VendorCreateNestedOneWithoutTechnicalIssueInputObjectSchema as VendorCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './VendorCreateNestedOneWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  area: z.string().optional().nullable(),
  issueType: TechnicalIssueTypeSchema.optional(),
  actionMode: TechnicalActionModeSchema.optional(),
  note: z.string().optional().nullable(),
  estimatedCost: z.number().optional().nullable(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  vendorNameSnap: z.string().optional().nullable(),
  TechnicalAssessment: z.lazy(() => TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInputObjectSchema),
  ServiceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedOneWithoutTechnicalIssueInputObjectSchema).optional()
}).strict();
export const TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateWithoutSupplyCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateWithoutSupplyCatalogInput>;
export const TechnicalIssueCreateWithoutSupplyCatalogInputObjectZodSchema = makeSchema();
