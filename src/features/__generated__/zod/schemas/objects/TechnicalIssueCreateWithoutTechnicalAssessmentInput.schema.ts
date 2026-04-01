import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { ServiceCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema as ServiceCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogCreateNestedOneWithoutTechnicalIssueInput.schema';
import { SupplyCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema as SupplyCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './SupplyCatalogCreateNestedOneWithoutTechnicalIssueInput.schema'

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
  ServiceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema).optional(),
  SupplyCatalog: z.lazy(() => SupplyCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema).optional()
}).strict();
export const TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateWithoutTechnicalAssessmentInput>;
export const TechnicalIssueCreateWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
