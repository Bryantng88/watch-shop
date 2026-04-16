import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumTechnicalMovementKindWithAggregatesFilterObjectSchema as EnumTechnicalMovementKindWithAggregatesFilterObjectSchema } from './EnumTechnicalMovementKindWithAggregatesFilter.schema';
import { TechnicalMovementKindSchema } from '../enums/TechnicalMovementKind.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { EnumTechnicalActionModeWithAggregatesFilterObjectSchema as EnumTechnicalActionModeWithAggregatesFilterObjectSchema } from './EnumTechnicalActionModeWithAggregatesFilter.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumTechnicalAssessmentStatusWithAggregatesFilterObjectSchema as EnumTechnicalAssessmentStatusWithAggregatesFilterObjectSchema } from './EnumTechnicalAssessmentStatusWithAggregatesFilter.schema';
import { TechnicalAssessmentStatusSchema } from '../enums/TechnicalAssessmentStatus.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { EnumTechnicalSectionStatusWithAggregatesFilterObjectSchema as EnumTechnicalSectionStatusWithAggregatesFilterObjectSchema } from './EnumTechnicalSectionStatusWithAggregatesFilter.schema';
import { TechnicalSectionStatusSchema } from '../enums/TechnicalSectionStatus.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema'

const technicalassessmentscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TechnicalAssessmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TechnicalAssessmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TechnicalAssessmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TechnicalAssessmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TechnicalAssessmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  serviceRequestId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  movementKind: z.union([z.lazy(() => EnumTechnicalMovementKindWithAggregatesFilterObjectSchema), TechnicalMovementKindSchema]).optional(),
  preRate: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  preAmplitude: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  preBeatError: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  postRate: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  postAmplitude: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  postBeatError: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  actionMode: z.union([z.lazy(() => EnumTechnicalActionModeWithAggregatesFilterObjectSchema), TechnicalActionModeSchema]).optional(),
  vendorId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  vendorNameSnap: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  conclusion: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  imageFileKey: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumTechnicalAssessmentStatusWithAggregatesFilterObjectSchema), TechnicalAssessmentStatusSchema]).optional(),
  evaluatedById: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  evaluatedByNameSnap: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  movementStatus: z.union([z.lazy(() => EnumTechnicalSectionStatusWithAggregatesFilterObjectSchema), TechnicalSectionStatusSchema]).optional(),
  caseStatus: z.union([z.lazy(() => EnumTechnicalSectionStatusWithAggregatesFilterObjectSchema), TechnicalSectionStatusSchema]).optional(),
  crystalStatus: z.union([z.lazy(() => EnumTechnicalSectionStatusWithAggregatesFilterObjectSchema), TechnicalSectionStatusSchema]).optional(),
  crownStatus: z.union([z.lazy(() => EnumTechnicalSectionStatusWithAggregatesFilterObjectSchema), TechnicalSectionStatusSchema]).optional(),
  payloadJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional()
}).strict();
export const TechnicalAssessmentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentScalarWhereWithAggregatesInput> = technicalassessmentscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TechnicalAssessmentScalarWhereWithAggregatesInput>;
export const TechnicalAssessmentScalarWhereWithAggregatesInputObjectZodSchema = technicalassessmentscalarwherewithaggregatesinputSchema;
