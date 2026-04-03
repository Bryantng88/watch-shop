import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { UuidNullableFilterObjectSchema as UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ApprovalRequestsNullableScalarRelationFilterObjectSchema as ApprovalRequestsNullableScalarRelationFilterObjectSchema } from './ApprovalRequestsNullableScalarRelationFilter.schema';
import { approvalRequestsWhereInputObjectSchema as approvalRequestsWhereInputObjectSchema } from './approvalRequestsWhereInput.schema';
import { TechnicalAssessmentsNullableScalarRelationFilterObjectSchema as TechnicalAssessmentsNullableScalarRelationFilterObjectSchema } from './TechnicalAssessmentsNullableScalarRelationFilter.schema';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './technicalAssessmentsWhereInput.schema'

const maintenancelogswhereinputSchema = z.object({
  AND: z.union([z.lazy(() => maintenanceLogsWhereInputObjectSchema), z.lazy(() => maintenanceLogsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => maintenanceLogsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => maintenanceLogsWhereInputObjectSchema), z.lazy(() => maintenanceLogsWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  serviceRequestId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  technicalAssessmentId: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  approvalRequestId: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sourceType: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  category: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  action: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  execution: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  vendorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  partId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  cost: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  autoApproved: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  approvalRequests: z.union([z.lazy(() => ApprovalRequestsNullableScalarRelationFilterObjectSchema), z.lazy(() => approvalRequestsWhereInputObjectSchema)]).optional(),
  technicalAssessments: z.union([z.lazy(() => TechnicalAssessmentsNullableScalarRelationFilterObjectSchema), z.lazy(() => technicalAssessmentsWhereInputObjectSchema)]).optional()
}).strict();
export const maintenanceLogsWhereInputObjectSchema: z.ZodType<Prisma.maintenanceLogsWhereInput> = maintenancelogswhereinputSchema as unknown as z.ZodType<Prisma.maintenanceLogsWhereInput>;
export const maintenanceLogsWhereInputObjectZodSchema = maintenancelogswhereinputSchema;
