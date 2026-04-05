import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UuidNullableFilterObjectSchema as UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TechnicalAssessmentsNullableScalarRelationFilterObjectSchema as TechnicalAssessmentsNullableScalarRelationFilterObjectSchema } from './TechnicalAssessmentsNullableScalarRelationFilter.schema';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './technicalAssessmentsWhereInput.schema'

const approvalrequestswhereinputSchema = z.object({
  AND: z.union([z.lazy(() => approvalRequestsWhereInputObjectSchema), z.lazy(() => approvalRequestsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => approvalRequestsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => approvalRequestsWhereInputObjectSchema), z.lazy(() => approvalRequestsWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sourceModule: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  technicalAssessmentId: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  summary: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  autoApproved: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  payloadJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  reviewNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  technicalAssessments: z.union([z.lazy(() => TechnicalAssessmentsNullableScalarRelationFilterObjectSchema), z.lazy(() => technicalAssessmentsWhereInputObjectSchema)]).optional()
}).strict();
export const approvalRequestsWhereInputObjectSchema: z.ZodType<Prisma.approvalRequestsWhereInput> = approvalrequestswhereinputSchema as unknown as z.ZodType<Prisma.approvalRequestsWhereInput>;
export const approvalRequestsWhereInputObjectZodSchema = approvalrequestswhereinputSchema;
