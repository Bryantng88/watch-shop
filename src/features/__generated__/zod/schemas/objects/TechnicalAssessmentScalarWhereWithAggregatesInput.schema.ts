import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumTechnicalMovementKindWithAggregatesFilterObjectSchema as EnumTechnicalMovementKindWithAggregatesFilterObjectSchema } from './EnumTechnicalMovementKindWithAggregatesFilter.schema';
import { TechnicalMovementKindSchema } from '../enums/TechnicalMovementKind.schema';
import { BoolNullableWithAggregatesFilterObjectSchema as BoolNullableWithAggregatesFilterObjectSchema } from './BoolNullableWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { EnumTechnicalActionModeWithAggregatesFilterObjectSchema as EnumTechnicalActionModeWithAggregatesFilterObjectSchema } from './EnumTechnicalActionModeWithAggregatesFilter.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumTechnicalAssessmentStatusWithAggregatesFilterObjectSchema as EnumTechnicalAssessmentStatusWithAggregatesFilterObjectSchema } from './EnumTechnicalAssessmentStatusWithAggregatesFilter.schema';
import { TechnicalAssessmentStatusSchema } from '../enums/TechnicalAssessmentStatus.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const technicalassessmentscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TechnicalAssessmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TechnicalAssessmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TechnicalAssessmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TechnicalAssessmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TechnicalAssessmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  serviceRequestId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  movementKind: z.union([z.lazy(() => EnumTechnicalMovementKindWithAggregatesFilterObjectSchema), TechnicalMovementKindSchema]).optional(),
  runningOk: z.union([z.lazy(() => BoolNullableWithAggregatesFilterObjectSchema), z.boolean()]).optional().nullable(),
  batteryWeak: z.union([z.lazy(() => BoolNullableWithAggregatesFilterObjectSchema), z.boolean()]).optional().nullable(),
  batteryIssueBattery: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  batteryIssueIC: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  batteryIssueCoil: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  preRate: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  preAmplitude: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  preBeatError: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  postRate: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  postAmplitude: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  postBeatError: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  actionMode: z.union([z.lazy(() => EnumTechnicalActionModeWithAggregatesFilterObjectSchema), TechnicalActionModeSchema]).optional(),
  vendorId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  vendorNameSnap: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  diagnosis: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  conclusion: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  imageFileKey: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumTechnicalAssessmentStatusWithAggregatesFilterObjectSchema), TechnicalAssessmentStatusSchema]).optional(),
  evaluatedById: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  evaluatedByNameSnap: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TechnicalAssessmentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentScalarWhereWithAggregatesInput> = technicalassessmentscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TechnicalAssessmentScalarWhereWithAggregatesInput>;
export const TechnicalAssessmentScalarWhereWithAggregatesInputObjectZodSchema = technicalassessmentscalarwherewithaggregatesinputSchema;
