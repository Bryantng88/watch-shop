import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalMovementKindSchema } from '../enums/TechnicalMovementKind.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { TechnicalAssessmentStatusSchema } from '../enums/TechnicalAssessmentStatus.schema';
import { TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalAssessmentInputObjectSchema as TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalAssessmentInputObjectSchema } from './TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  serviceRequestId: z.string(),
  movementKind: TechnicalMovementKindSchema.optional(),
  runningOk: z.boolean().optional().nullable(),
  batteryWeak: z.boolean().optional().nullable(),
  batteryIssueBattery: z.boolean().optional(),
  batteryIssueIC: z.boolean().optional(),
  batteryIssueCoil: z.boolean().optional(),
  preRate: z.number().int().optional().nullable(),
  preAmplitude: z.number().int().optional().nullable(),
  preBeatError: z.number().optional().nullable(),
  postRate: z.number().int().optional().nullable(),
  postAmplitude: z.number().int().optional().nullable(),
  postBeatError: z.number().optional().nullable(),
  actionMode: TechnicalActionModeSchema.optional(),
  vendorId: z.string().optional().nullable(),
  vendorNameSnap: z.string().optional().nullable(),
  diagnosis: z.string().optional().nullable(),
  conclusion: z.string().optional().nullable(),
  imageFileKey: z.string().optional().nullable(),
  status: TechnicalAssessmentStatusSchema.optional(),
  evaluatedById: z.string().optional().nullable(),
  evaluatedByNameSnap: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalAssessmentInputObjectSchema)
}).strict();
export const TechnicalAssessmentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUncheckedCreateInput>;
export const TechnicalAssessmentUncheckedCreateInputObjectZodSchema = makeSchema();
