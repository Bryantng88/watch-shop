import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ApprovalRequestsListRelationFilterObjectSchema as ApprovalRequestsListRelationFilterObjectSchema } from './ApprovalRequestsListRelationFilter.schema'

const technicalassessmentswhereinputSchema = z.object({
  AND: z.union([z.lazy(() => technicalAssessmentsWhereInputObjectSchema), z.lazy(() => technicalAssessmentsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => technicalAssessmentsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => technicalAssessmentsWhereInputObjectSchema), z.lazy(() => technicalAssessmentsWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  serviceRequestId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  machineType: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  movementStatus: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  beforeRate: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  beforeAmp: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  beforeErr: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  afterRate: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  afterAmp: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  afterErr: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  appearanceScore: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  caseScore: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  glassScore: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  dialScore: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  caseIssues: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  glassIssues: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  dialIssues: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  caseManualDeduction: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  glassManualDeduction: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  dialManualDeduction: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  caseNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  glassNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  dialNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  crownStatus: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  crownAction: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  crownExecution: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  crownVendorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  crownPartId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  crownCost: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  crownNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  movementCost: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  crownCostTotal: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  cosmeticProposalCost: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  totalCost: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  conclusion: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  approvalRequests: z.lazy(() => ApprovalRequestsListRelationFilterObjectSchema).optional()
}).strict();
export const technicalAssessmentsWhereInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsWhereInput> = technicalassessmentswhereinputSchema as unknown as z.ZodType<Prisma.technicalAssessmentsWhereInput>;
export const technicalAssessmentsWhereInputObjectZodSchema = technicalassessmentswhereinputSchema;
