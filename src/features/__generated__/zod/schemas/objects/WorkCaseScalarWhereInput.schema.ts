import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumWorkCaseScopeFilterObjectSchema as EnumWorkCaseScopeFilterObjectSchema } from './EnumWorkCaseScopeFilter.schema';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { EnumWorkCaseStatusFilterObjectSchema as EnumWorkCaseStatusFilterObjectSchema } from './EnumWorkCaseStatusFilter.schema';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema';
import { EnumTaskPriorityFilterObjectSchema as EnumTaskPriorityFilterObjectSchema } from './EnumTaskPriorityFilter.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { UuidNullableFilterObjectSchema as UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const workcasescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkCaseScalarWhereInputObjectSchema), z.lazy(() => WorkCaseScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkCaseScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkCaseScalarWhereInputObjectSchema), z.lazy(() => WorkCaseScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  refNo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => EnumWorkCaseScopeFilterObjectSchema), WorkCaseScopeSchema]).optional(),
  status: z.union([z.lazy(() => EnumWorkCaseStatusFilterObjectSchema), WorkCaseStatusSchema]).optional(),
  priority: z.union([z.lazy(() => EnumTaskPriorityFilterObjectSchema), TaskPrioritySchema]).optional(),
  watchId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  categoryId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipmentId: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  raisedByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  assignedToUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  triagedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  resolvedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  cancelledAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WorkCaseScalarWhereInputObjectSchema: z.ZodType<Prisma.WorkCaseScalarWhereInput> = workcasescalarwhereinputSchema as unknown as z.ZodType<Prisma.WorkCaseScalarWhereInput>;
export const WorkCaseScalarWhereInputObjectZodSchema = workcasescalarwhereinputSchema;
