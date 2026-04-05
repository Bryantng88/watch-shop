import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { TechnicalIssueExecutionStatusSchema } from '../enums/TechnicalIssueExecutionStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  area: z.string().optional().nullable(),
  issueType: TechnicalIssueTypeSchema.optional(),
  actionMode: TechnicalActionModeSchema.optional(),
  serviceCatalogId: z.string().optional().nullable(),
  supplyCatalogId: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  estimatedCost: z.number().optional().nullable(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  vendorId: z.string().optional().nullable(),
  vendorNameSnap: z.string().optional().nullable(),
  mechanicalPartCatalogId: z.string().optional().nullable(),
  serviceRequestId: z.string(),
  executionStatus: TechnicalIssueExecutionStatusSchema.optional(),
  openedAt: z.coerce.date(),
  startedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),
  actualCost: z.number().optional().nullable(),
  technicianId: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  resolutionNote: z.string().optional().nullable(),
  completedByNameSnap: z.string().optional().nullable()
}).strict();
export const TechnicalIssueCreateManyTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateManyTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateManyTechnicalAssessmentInput>;
export const TechnicalIssueCreateManyTechnicalAssessmentInputObjectZodSchema = makeSchema();
