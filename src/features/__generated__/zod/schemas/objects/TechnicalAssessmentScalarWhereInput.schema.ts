import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumTechnicalMovementKindFilterObjectSchema as EnumTechnicalMovementKindFilterObjectSchema } from './EnumTechnicalMovementKindFilter.schema';
import { TechnicalMovementKindSchema } from '../enums/TechnicalMovementKind.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { EnumTechnicalActionModeFilterObjectSchema as EnumTechnicalActionModeFilterObjectSchema } from './EnumTechnicalActionModeFilter.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumTechnicalAssessmentStatusFilterObjectSchema as EnumTechnicalAssessmentStatusFilterObjectSchema } from './EnumTechnicalAssessmentStatusFilter.schema';
import { TechnicalAssessmentStatusSchema } from '../enums/TechnicalAssessmentStatus.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumTechnicalSectionStatusFilterObjectSchema as EnumTechnicalSectionStatusFilterObjectSchema } from './EnumTechnicalSectionStatusFilter.schema';
import { TechnicalSectionStatusSchema } from '../enums/TechnicalSectionStatus.schema'

const technicalassessmentscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TechnicalAssessmentScalarWhereInputObjectSchema), z.lazy(() => TechnicalAssessmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TechnicalAssessmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TechnicalAssessmentScalarWhereInputObjectSchema), z.lazy(() => TechnicalAssessmentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  serviceRequestId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  movementKind: z.union([z.lazy(() => EnumTechnicalMovementKindFilterObjectSchema), TechnicalMovementKindSchema]).optional(),
  preRate: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  preAmplitude: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  preBeatError: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  postRate: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  postAmplitude: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  postBeatError: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  actionMode: z.union([z.lazy(() => EnumTechnicalActionModeFilterObjectSchema), TechnicalActionModeSchema]).optional(),
  vendorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  vendorNameSnap: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  conclusion: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  imageFileKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumTechnicalAssessmentStatusFilterObjectSchema), TechnicalAssessmentStatusSchema]).optional(),
  evaluatedById: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  evaluatedByNameSnap: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  movementStatus: z.union([z.lazy(() => EnumTechnicalSectionStatusFilterObjectSchema), TechnicalSectionStatusSchema]).optional(),
  caseStatus: z.union([z.lazy(() => EnumTechnicalSectionStatusFilterObjectSchema), TechnicalSectionStatusSchema]).optional(),
  crystalStatus: z.union([z.lazy(() => EnumTechnicalSectionStatusFilterObjectSchema), TechnicalSectionStatusSchema]).optional(),
  crownStatus: z.union([z.lazy(() => EnumTechnicalSectionStatusFilterObjectSchema), TechnicalSectionStatusSchema]).optional()
}).strict();
export const TechnicalAssessmentScalarWhereInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentScalarWhereInput> = technicalassessmentscalarwhereinputSchema as unknown as z.ZodType<Prisma.TechnicalAssessmentScalarWhereInput>;
export const TechnicalAssessmentScalarWhereInputObjectZodSchema = technicalassessmentscalarwhereinputSchema;
