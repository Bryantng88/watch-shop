import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogCreateNestedOneWithoutTechnicalIssueInput.schema';
import { SupplyCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema as SupplyCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogCreateNestedOneWithoutTechnicalIssueInput.schema';
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
  MechanicalPartCatalog: z.lazy(() => MechanicalPartCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema).optional(),
  SupplyCatalog: z.lazy(() => SupplyCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedOneWithoutTechnicalIssueInputObjectSchema).optional()
}).strict();
export const TechnicalIssueCreateWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateWithoutServiceCatalogInput>;
export const TechnicalIssueCreateWithoutServiceCatalogInputObjectZodSchema = makeSchema();
