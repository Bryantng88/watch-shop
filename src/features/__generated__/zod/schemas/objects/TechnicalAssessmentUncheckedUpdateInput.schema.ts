import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { TechnicalMovementKindSchema } from '../enums/TechnicalMovementKind.schema';
import { EnumTechnicalMovementKindFieldUpdateOperationsInputObjectSchema as EnumTechnicalMovementKindFieldUpdateOperationsInputObjectSchema } from './EnumTechnicalMovementKindFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { EnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema as EnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema } from './EnumTechnicalActionModeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { TechnicalAssessmentStatusSchema } from '../enums/TechnicalAssessmentStatus.schema';
import { EnumTechnicalAssessmentStatusFieldUpdateOperationsInputObjectSchema as EnumTechnicalAssessmentStatusFieldUpdateOperationsInputObjectSchema } from './EnumTechnicalAssessmentStatusFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TechnicalSectionStatusSchema } from '../enums/TechnicalSectionStatus.schema';
import { EnumTechnicalSectionStatusFieldUpdateOperationsInputObjectSchema as EnumTechnicalSectionStatusFieldUpdateOperationsInputObjectSchema } from './EnumTechnicalSectionStatusFieldUpdateOperationsInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutTechnicalAssessmentNestedInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutTechnicalAssessmentNestedInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutTechnicalAssessmentNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  serviceRequestId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  movementKind: z.union([TechnicalMovementKindSchema, z.lazy(() => EnumTechnicalMovementKindFieldUpdateOperationsInputObjectSchema)]).optional(),
  preRate: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  preAmplitude: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  preBeatError: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  postRate: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  postAmplitude: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  postBeatError: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  actionMode: z.union([TechnicalActionModeSchema, z.lazy(() => EnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema)]).optional(),
  vendorId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  vendorNameSnap: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  conclusion: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  imageFileKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  status: z.union([TechnicalAssessmentStatusSchema, z.lazy(() => EnumTechnicalAssessmentStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  evaluatedById: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  evaluatedByNameSnap: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  movementStatus: z.union([TechnicalSectionStatusSchema, z.lazy(() => EnumTechnicalSectionStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  caseStatus: z.union([TechnicalSectionStatusSchema, z.lazy(() => EnumTechnicalSectionStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  crystalStatus: z.union([TechnicalSectionStatusSchema, z.lazy(() => EnumTechnicalSectionStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  crownStatus: z.union([TechnicalSectionStatusSchema, z.lazy(() => EnumTechnicalSectionStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutTechnicalAssessmentNestedInputObjectSchema).optional()
}).strict();
export const TechnicalAssessmentUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUncheckedUpdateInput>;
export const TechnicalAssessmentUncheckedUpdateInputObjectZodSchema = makeSchema();
