import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalMovementKindSchema } from '../enums/TechnicalMovementKind.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { TechnicalAssessmentStatusSchema } from '../enums/TechnicalAssessmentStatus.schema';
import { TechnicalSectionStatusSchema } from '../enums/TechnicalSectionStatus.schema';
import { TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  serviceRequestId: z.string(),
  movementKind: TechnicalMovementKindSchema.optional(),
  preRate: z.number().int().optional().nullable(),
  preAmplitude: z.number().int().optional().nullable(),
  preBeatError: z.number().optional().nullable(),
  postRate: z.number().int().optional().nullable(),
  postAmplitude: z.number().int().optional().nullable(),
  postBeatError: z.number().optional().nullable(),
  actionMode: TechnicalActionModeSchema.optional(),
  vendorNameSnap: z.string().optional().nullable(),
  conclusion: z.string().optional().nullable(),
  imageFileKey: z.string().optional().nullable(),
  status: TechnicalAssessmentStatusSchema.optional(),
  evaluatedById: z.string().optional().nullable(),
  evaluatedByNameSnap: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  movementStatus: TechnicalSectionStatusSchema.optional(),
  caseStatus: TechnicalSectionStatusSchema.optional(),
  crystalStatus: TechnicalSectionStatusSchema.optional(),
  crownStatus: TechnicalSectionStatusSchema.optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalAssessmentInputObjectSchema).optional()
}).strict();
export const TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUncheckedCreateWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUncheckedCreateWithoutVendorInput>;
export const TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectZodSchema = makeSchema();
