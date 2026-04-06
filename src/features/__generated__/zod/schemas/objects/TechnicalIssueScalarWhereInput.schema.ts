import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumTechnicalIssueTypeFilterObjectSchema as EnumTechnicalIssueTypeFilterObjectSchema } from './EnumTechnicalIssueTypeFilter.schema';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema';
import { EnumTechnicalActionModeFilterObjectSchema as EnumTechnicalActionModeFilterObjectSchema } from './EnumTechnicalActionModeFilter.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumTechnicalIssueExecutionStatusFilterObjectSchema as EnumTechnicalIssueExecutionStatusFilterObjectSchema } from './EnumTechnicalIssueExecutionStatusFilter.schema';
import { TechnicalIssueExecutionStatusSchema } from '../enums/TechnicalIssueExecutionStatus.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema'

const technicalissuescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema), z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema), z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  assessmentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  area: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  issueType: z.union([z.lazy(() => EnumTechnicalIssueTypeFilterObjectSchema), TechnicalIssueTypeSchema]).optional(),
  actionMode: z.union([z.lazy(() => EnumTechnicalActionModeFilterObjectSchema), TechnicalActionModeSchema]).optional(),
  serviceCatalogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  supplyCatalogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  estimatedCost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  vendorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  vendorNameSnap: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  mechanicalPartCatalogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  executionStatus: z.union([z.lazy(() => EnumTechnicalIssueExecutionStatusFilterObjectSchema), TechnicalIssueExecutionStatusSchema]).optional(),
  openedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  startedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  completedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  canceledAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  actualCost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  technicianId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  summary: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  resolutionNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  completedByNameSnap: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isConfirmed: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  confirmedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  confirmedById: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  confirmedByNameSnap: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const TechnicalIssueScalarWhereInputObjectSchema: z.ZodType<Prisma.TechnicalIssueScalarWhereInput> = technicalissuescalarwhereinputSchema as unknown as z.ZodType<Prisma.TechnicalIssueScalarWhereInput>;
export const TechnicalIssueScalarWhereInputObjectZodSchema = technicalissuescalarwhereinputSchema;
